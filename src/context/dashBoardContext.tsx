import { createContext, useEffect, useRef, useState } from "react";
import { Chat, Friend }from "../../types/dashboard";

interface dashboardContextProps {
    children: React.ReactNode;
}

interface DashboardContext {
    getFriends: () => Promise<{message: string, friends: Friend[]}>;
    friends: Friend[];
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    currentChatMessages: Chat[] | [];
    setCurrentChatMessages: React.Dispatch<React.SetStateAction<Chat[] | []>>;
    roomId: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    chatAreaRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export const DashboardContext = createContext<DashboardContext>({} as DashboardContext) as React.Context<DashboardContext>;

export const DashboardProvider = ({ children }: dashboardContextProps) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [currentChatMessages, setCurrentChatMessages] = useState< Chat[] |[]>([]);
    const [roomId, setRoomId] = useState<string>("");
    const chatAreaRef = useRef<HTMLDivElement | null>(null);

    const getFriends = async () => {
        // Send the data to the server
        const res = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/chat/get-friends`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        const data = await res.json();

        // set the user in the context
        if (res.status === 200) {
            setFriends(data.friends as Friend[]);
        }
        // return the response
        return data;
    };

    const getCurrentChatMessages = async (roomId: string,number : number) => {
        // Send the data to the server
        const res = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/chat/get-messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ roomId, number }),
            }
        );
        const data = await res.json();

        // set the user in the context
        if (res.status === 200) {
            setCurrentChatMessages(data.messages as Chat[]);
            chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight);
        }
        // return the response
        return data;
    };

    useEffect(() => {
        getFriends();
    }, []);

    useEffect(() => {
        if (roomId !== "") {
            getCurrentChatMessages(roomId, 15);
        }
    }, [roomId]);

  return (
    <DashboardContext.Provider value={{getFriends,friends,setFriends, currentChatMessages, setCurrentChatMessages, roomId, setRoomId, chatAreaRef}}>
      {children}
    </DashboardContext.Provider>
  );
};
