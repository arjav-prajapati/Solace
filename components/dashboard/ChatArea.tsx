import React, { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../src/context/SocketProvider";
import EmojiPickerComponent from "../../components/dashboard/EmojiPickerComponent";
import { Friend } from "../../types/dashboard";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../../src/context/dashBoardContext";

interface ChatAreaProps {
  friends: Friend[];
  roomId: string;
  user: { email: string; name: string } | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ friends, roomId, user }) => {
  const { sendMessage } = useSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend>({} as Friend);
  const msgFieldRef = useRef(null);
  const { joinRoom } = useSocket();
  const { setCurrentChatMessages, currentChatMessages, setRoomId, chatAreaRef } =
    useContext(DashboardContext);
  const handleTextarea = (e: any) => {
    const textarea = e.target;
    const lineHeight = 24;
    const previousRows = textarea.rows;
    textarea.rows = 1;
    const currentRows = Math.floor(textarea.scrollHeight / lineHeight);
    if (currentRows === previousRows) {
      textarea.rows = currentRows;
    }
    if (currentRows >= 4) {
      textarea.rows = 4;
      textarea.scrollTop = textarea.scrollHeight;
    }

    setMessages(textarea.value);
  };

  const onEmojiSelect = (emoji: any) => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.value += emoji.emoji;
      setMessages(textarea.value);
    }
    if (msgFieldRef.current)
      (msgFieldRef.current as HTMLTextAreaElement).focus();
  };
  useEffect(() => {
    if (msgFieldRef.current)
      (msgFieldRef.current as HTMLTextAreaElement).focus();

    if(roomId === "" ){
      navigate("/dashboard");
    }else{
        joinRoom(roomId);
    }
  }, []);

  //to convert date into formatted date
  function formatDateTime(inputDate : Date | string) {
    const date = new Date(inputDate);
  
    // Extracting day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Convert hours to 12-hour format and determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Adjusting for 12-hour format
  
    // Format the date string
    const formattedDateString =
      `${day} ${month} ${year < new Date().getFullYear() ? year : ''} ` +
      `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
    return formattedDateString;
  }


  useEffect(() => {
    if (!friends || !roomId || !user || roomId === "") {
      navigate("/dashboard");
    } else {
      const friend = friends.find((friend) => friend.roomId === roomId);
      setSelectedFriend(friend === undefined ? {} as Friend : friend);
      setRoomId(roomId);
    }
  }, [friends, roomId, user, navigate, joinRoom]);


  useEffect(() => {
    chatAreaRef?.current?.scrollTo(0, chatAreaRef.current?.scrollHeight);
  }, [currentChatMessages]);

  return (
    <div className="chat-area flex-1 flex flex-col">
      <div className="flex-3">
        <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-600">
          Chatting with <b className="text-gray-300">{selectedFriend?.name}</b>
        </h2>
      </div>
      <div ref={chatAreaRef} className="messages flex-1 overflow-y-scroll max-h-[420px] no-scroll-bar">
        {currentChatMessages.map((message,index) => {
          return (
            <div key={index}>
              {user?.email === message.senderMail ? (
                <div className="message me mb-4 flex text-right">
                  <div className="flex-1 px-2">
                    <div className="w-fit inline-block">
                      <div className="flex">
                        {
                            // check if the message is sent
                            (message.status === "01"  || message.status==="10") &&
                            <div className="w-10 -mr-8 border-l-2 rounded-full border-gray-400"></div>
                        }
                        {
                            // check if the message is delivered
                            message.status === "10" &&
                            <div className="w-10 -mr-8 border-l-2 rounded-full border-gray-400"></div>
                        }
                        {
                            // check if the message is read
                            message.status === "11" &&
                            <>
                            <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                            <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                            </>
                        }
                        <div className="bg-blue-600 rounded-full p-2 px-6 text-white">
                          <span>{message.message}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pr-4">
                      <small className="text-gray-500">
                        {formatDateTime(message.time)}
                      </small>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message mb-4 flex">
                  <div className="flex-2">
                    <div className="w-12 h-12 relative">
                      <img
                        className="w-12 h-12 rounded-full mx-auto"
                        src="../resources/profile-image.png"
                        alt="chat-user"
                      />
                      <span
                        className={`absolute w-4 h-4 ${
                          selectedFriend?.isLive
                            ? "bg-green-400"
                            : "bg-gray-400"
                        } rounded-full right-0 bottom-0 border-2 border-gray-800`}
                      ></span>
                    </div>
                  </div>
                  <div className="flex-1 px-2">
                    <div className="inline-block bg-gray-700 rounded-full p-2 px-6 text-gray-300">
                      <span>{message.message}</span>
                    </div>
                    <div className="pl-4">
                      <small className="text-gray-500">
                        {formatDateTime(message.time)}
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* <div className="message mb-4 flex">
          <div className="flex-2">
            <div className="w-12 h-12 relative">
              <img
                className="w-12 h-12 rounded-full mx-auto"
                src="../resources/profile-image.png"
                alt="chat-user"
              />
              <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-gray-800"></span>
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block bg-gray-700 rounded-full p-2 px-6 text-gray-300">
              <span>
                Hey there. We would like to invite you over to our office for a
                visit. How about it?
              </span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="message mb-4 flex">
          <div className="flex-2">
            <div className="w-12 h-12 relative">
              <img
                className="w-12 h-12 rounded-full mx-auto"
                src="../resources/profile-image.png"
                alt="chat-user"
              />
              <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-gray-800"></span>
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block bg-gray-700 rounded-full p-2 px-6 text-gray-300">
              <span>All travel expenses are covered by us of course :D</span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="message me mb-4 flex text-right">
          <div className="flex-1 px-2">
            <div className="w-fit inline-block">
              <div className="flex">
                <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                <div className="bg-blue-600 rounded-full p-2 px-6 text-white">
                  <span>It's like a dream come true</span>
                </div>
              </div>
            </div>
            <div className="pr-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="message me mb-4 flex text-right">
          <div className="flex-1 px-2">
            <div className="w-fit inline-block">
              <div className="flex">
                <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                <div className="w-10 -mr-8 border-l-2 rounded-full border-blue-900"></div>
                <div className="bg-blue-600 rounded-full p-2 px-6 text-white">
                  <span>I accept. Thank you very much.</span>
                </div>
              </div>
            </div>
            <div className="pr-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="message mb-4 flex">
          <div className="flex-2">
            <div className="w-12 h-12 relative">
              <img
                className="w-12 h-12 rounded-full mx-auto"
                src="../resources/profile-image.png"
                alt="chat-user"
              />
              <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-gray-800"></span>
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block bg-gray-700 rounded-full p-2 px-6 text-gray-300">
              <span>You are welcome. We will stay in touch.</span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div> */}
      </div>

      <form className="flex-2 pt-4 pb-10">
        <div className="write bg-gray-900 shadow flex rounded-lg">
          <div className="relative flex-3 flex content-center items-center text-center p-4 pr-0">
            <div
              className={`absolute -left-36 ${
                isEmojiPickerOpen
                  ? "scale-100 -translate-y-64 translate-x-36"
                  : "translate-y-0 overflow-hidden scale-0"
              } transition-transform ease-in-out duration-300`}
            >
              <EmojiPickerComponent clickHandler={onEmojiSelect} />
            </div>
            <span
              className="block text-center text-gray-400 hover:text-gray-300"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke={`${isEmojiPickerOpen ? "blue" : "currentColor"}`}
                viewBox="0 0 24 24"
                className="h-6 w-6"
              >
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span>
          </div>
          <div className="flex-1">
            <textarea
              ref={msgFieldRef}
              name="message"
              onChange={handleTextarea}
              className="w-full block outline-none py-4 px-4 bg-transparent resize-none leading-6 text-gray-300"
              rows={1}
              value={messages}
              placeholder="Type a message..."
              autoFocus
            ></textarea>
            <div id="lineNo"></div>
          </div>
          <div className="flex-2 w-32 p-2 flex content-center items-center">
            <div className="flex-1 text-center">
              <span className="text-gray-400 hover:text-gray-300">
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex-1">
              <button
                type="submit"
                className="bg-blue-600 w-10 h-10 rounded-full inline-block"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentChatMessages((prev) => [
                    ...prev,
                    {
                      messageId: "",
                      senderMail: user?.email || "",
                      receiverMail: selectedFriend.email,
                      message: messages,
                      time: new Date(),
                      roomId: selectedFriend?.roomId || "",
                      status: "00",
                    },
                  ]);
                  sendMessage(messages, selectedFriend?.email, selectedFriend?.roomId);
                  setMessages("");
                  if(msgFieldRef.current)
                    (msgFieldRef.current as HTMLTextAreaElement).focus();
                }}
              >
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
