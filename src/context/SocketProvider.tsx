"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext, getUser } from "./AuthContext";
import { DashboardContext } from "./dashBoardContext";
import { useNavigate } from "react-router-dom";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SocketContext {
  sendMessage: (
    message: string,
    email: string | undefined,
    roomId: string | undefined
  ) => any;
  joinRoom: (room: string) => any;
}

const SocketContext = React.createContext<SocketContext | null>(null);

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  // make a socket state
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const {
    setFriends,
    currentChatMessages,
    setCurrentChatMessages,
    roomId,
    chatAreaRef,
  } = React.useContext(DashboardContext);
  const { user } = React.useContext(AuthContext);

  let _socket: Socket;

  // initialize socket client
  useEffect(() => {
    _socket = io("http://localhost:5400", {
      withCredentials: true,
      //data,
      query: {
        email: user?.email,
      },
    });

    _socket.on("connect", () => {
      console.log("Socket connected!");
      setSocket(_socket);
    });

    if (user?.email === undefined) {
      getUser()
        .then((user) => {
          _socket.emit("isLive", { email: user?.email, isLive: true });
        })
        .catch((err) => {
          //redirect to login page
          console.log(err);
          navigate("/login");
          return;
        });
    } else {
      _socket.emit("isLive", { email: user?.email, isLive: true });
    }

    return () => {
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  useEffect(() => {
    if (socket !== undefined) {
      socket.on("message", (data) => {
        console.log(
          chatAreaRef?.current?.scrollHeight,
          chatAreaRef?.current?.scrollTop,
          chatAreaRef?.current?.clientHeight
        );
        console.log(data, user);
        if (data.roomId === undefined) {
          return;
        }

        //add message to last chat of the friend
        
        
        if (data.senderMail === user?.email) {
          console.log("Message sent by user");
          //find the message in the current chat messages and update the status
          setCurrentChatMessages((prev) => {
            return prev.map((message) => {
              const date = new Date(message?.time).toISOString();
              if (message.message === data.message && date === data.time) {
                return {
                  ...message,
                  status: data.status,
                  messageId: data.messageId,
                };
              }
              return message;
            });
          });

          //update the last message of the friend
          setFriends((prev) => {
            return prev.map((friend) => {
              if (friend.email === data.receiverMail) {
                return {
                  ...friend,
                  lastMessage: {
                    message: data.message,
                    time: data.time,
                    senderMail: data.senderMail,
                  },
                  unreadCount: friend.unreadCount,
                };
              }
              return friend;
            });
          });

          return;
        }
        
        setFriends((prev) => {
          return prev.map((friend) => {
            if (friend.email === data.senderMail) {
              return {
                ...friend,
                lastMessage: {
                  message: data.message,
                  time: data.time,
                  senderMail: data.senderMail,
                },
                unreadCount: roomId !== data.roomId ? friend.unreadCount + 1 : friend.unreadCount,
              };
            }
            return friend;
          });
        });

        //add message to current chat so it adds only once
        const messageExists = currentChatMessages.some(
          (message) =>
            message.messageId === data.messageId ||
          (message.message === data.message &&
              message.time?.toISOString() === data.time)
            );
        if (!messageExists) {
          // Add the message to currentChatMessages only if it doesn't already exist
          setCurrentChatMessages((prev) => [
            ...prev,
            {
              message: data.message,
              senderMail: data.senderMail,
              receiverMail: data.receiverMail,
              time: data.time,
              status: data.status,
              messageId: data.messageId,
              roomId: data.roomId,
            },
          ]);
          chatAreaRef?.current?.scrollTo(0, chatAreaRef?.current?.scrollHeight);
        }
        //if the message is from current chat room then add the message to the current chat messages onlt once
      });

      socket.on("isLive", (data) => {
        // set friend status to online
        setFriends((prev) => {
          return prev.map((friend) => {
            if (friend.email === data.email) {
              return { ...friend, isLive: data.isLive };
            }
            return friend;
          });
        });

        // set current chat messages status to online
        setCurrentChatMessages((prev) => {
          return prev.map((message) => {
            if (message.status === "01") {
              return { ...message, status: data.isLive ? "10" : "01" };
            }
            return message;
          });
        });
      });

      socket.on("joinedRoom", (data) => {
        if (data.email === user?.email) {
          return;
        }
        setCurrentChatMessages((prev) => {
          return prev.map((message) => {
            if (message.roomId === data.roomId) {
              return { ...message, status: "11" };
            }
            return message;
          });
        });
      });
    }
  }, [socket]);

  const sendMessage = useCallback(
    async (message: string, email: string | undefined) => {
      if (email === undefined) {
        return;
      }

      if (socket) {
        socket.emit("message", {
          message,
          receiverMail: email,
          roomId,
          time: new Date(),
          status: "00",
        });
      }
    },
    [socket, roomId]
  );

  const joinRoom = useCallback(
    (room: string) => {
      console.log("Joining room", room);
      if (room === "") {
        room = roomId;
      }
      if (socket) {
        socket.emit("join", room);
      }
    },
    [socket, roomId]
  );

  return (
    <SocketContext.Provider value={{ sendMessage, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

// creating a custom hook to use the socket context
export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
