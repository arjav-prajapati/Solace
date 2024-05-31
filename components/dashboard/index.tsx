import { useContext, useEffect, useState } from "react";
import { AuthContext, getUser } from "../../src/context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import siteLogo from "/assets/images/logo/site-logo.png";
import "../../src/index.css";
import ChatArea from "./ChatArea";
import { DashboardContext } from "../../src/context/dashBoardContext";
import SearchList from "./SearchList";
import { X } from "lucide-react";

const DashboardCmp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { friends, setRoomId, addFriend, removeFriend } =
    useContext(DashboardContext);
  const [searchFriends, setSearchFriends] = useState<string>("");
  const [searchedFriends, setSearchedFriends] = useState<any[]>([]);
  const [isBeingSearched, setIsBeingSearched] = useState<boolean>(false);
  const [isAddRemoveFriend, setIsAddRemoveFriend] = useState<boolean>(false);
  const router = useNavigate();
  //get params
  const { id } = useParams();
  useEffect(() => {
    setRoomId(id === undefined ? "" : id);
  }, [id]);

  useEffect(() => {
    //send the search query to the server
    const fetchSearchFriends = async () => {
      setIsBeingSearched(true);
      if (searchFriends === "") {
        setIsBeingSearched(false);
        setSearchedFriends([]);
        return;
      }
      const res = await fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/friends/search-friends?search=${searchFriends}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (res.status === 200) {
        const data = await res.json();
        setSearchedFriends(data.friends);
      }
      setIsBeingSearched(false);
    };

    fetchSearchFriends();
  }, [searchFriends]);

  //get context of auth
  const { setIsLoggedIn, user, setUser } = useContext(AuthContext) || {};

  //get navigation
  const navigate = useNavigate();

  function formatDate(inputDate: Date | string) {
    const date = new Date(inputDate);

    // Extracting day, month, year, hours, and minutes
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Format the date string
    const formattedDateString = `${day} ${month} ${
      year < new Date().getFullYear() ? year : ""
    } `;

    return formattedDateString;
  }

  //get the user from the context
  useEffect(() => {
    if (!user) {
      const fetchData = async () => {
        const res = await getUser();
        if (res) {
          //set the user in the context
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(res);
          return;
        }

        //if user is not found then navigate to login
        setIsLoading(false);
        navigate("/login");
      };
      setRoomId(id === undefined ? "" : id);

      fetchData();
    }
  }, [friends]);

  return (
    <div className="w-full h-screen bg-gray-900 text-gray-300">
      <div className="flex h-full">
        <div className="flex-1 bg-gray-800 w-full h-full overflow-y-hidden">
          <div className="main-body container m-auto w-11/12 h-full flex flex-col">
            <div className="py-4 flex-2 flex flex-row">
              <div className="flex items-center">
                <span
                  className="xl:hidden inline-block text-gray-400 hover:text-gray-200 align-bottom"
                  onClick={() => {}}
                >
                  <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </span>
                </span>
                <span className="lg:hidden inline-block ml-8 text-gray-400 hover:text-gray-200 align-bottom">
                  <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </span>
                </span>
                <span className="inline-block ml-8 text-gray-400 hover:text-gray-200 align-bottom">
                  {/* take solace logo */}
                  <span>
                    <img
                      src={siteLogo}
                      alt="site-logo"
                      className=" w-52 -mt-6 -ml-12 lg:-ml-14"
                    />
                  </span>
                </span>
              </div>
              <div className="flex-1 text-right">
                <span className="inline-block text-gray-400">
                  Status:{" "}
                  <span className="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></span>{" "}
                  <b>Online</b>
                  <span className="inline-block align-text-bottom">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </span>

                <span className="inline-block ml-8 text-gray-400 hover:text-gray-200 align-bottom">
                  <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-700">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                  </span>
                </span>
              </div>
            </div>

            <div className="main flex-1 flex flex-col">
              <div className="flex-1 flex h-full">
                <div className="relative sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
                  <div className="search relative flex-2 pb-6 px-2">
                    <input
                      type="text"
                      className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-600 text-gray-300"
                      placeholder="Search"
                      value={searchFriends}
                      onChange={(e) => setSearchFriends(e.target.value)}
                    />
                    {
                      //if list is empty then show the loader
                      searchedFriends.length !== 0 && (
                        <button
                          className="absolute z-50 top-2 right-5 hover:bg-gray-700"
                          onClick={() => {
                            setSearchFriends("");
                            setSearchedFriends([]);
                          }}
                        >
                          <X />
                        </button>
                      )
                    }
                  </div>
                  {
                    //if list is not empty then show the list
                    searchedFriends.length !== 0 && (
                      <SearchList
                        list={searchedFriends}
                        isLoading={isBeingSearched}
                        addFriend={async (email) => {
                          setIsAddRemoveFriend(true);
                          await addFriend(email);
                          setIsAddRemoveFriend(false);
                          setSearchFriends("");
                          setSearchedFriends([]);
                          router("/dashboard");
                        }}
                        removeFriend={async (email) => {
                          setIsAddRemoveFriend(true);
                          removeFriend(email);
                          setIsAddRemoveFriend(false);
                          setSearchFriends("");
                          setSearchedFriends([]);
                          router("/dashboard");
                        }}
                        isAddRemoveFriend={isAddRemoveFriend}
                      />
                    )
                  }
                  <div className="flex-1 h-full overflow-none px-2">
                    {friends &&
                      friends.length !== 0 &&
                      friends.map((friend: any) => {
                        return (
                          <Link
                            to={`/dashboard/${friend.roomId}`}
                            key={friend._id}
                            className={`entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-gray-800 mb-4 rounded p-4 flex shadow-md ${
                              id === friend.roomId
                                ? "border-l-4 border-red-500"
                                : ""
                            }`}
                          >
                            <div className="flex-2">
                              <div className="w-12 h-12 relative">
                                <img
                                  className="w-12 h-12 rounded-full mx-auto"
                                  src="../resources/profile-image.png"
                                  alt="chat-user"
                                />
                                <span
                                  className={`absolute w-4 h-4 ${
                                    friend.isLive
                                      ? "bg-green-400"
                                      : "bg-gray-400"
                                  } rounded-full right-0 bottom-0 border-2 border-gray-800`}
                                ></span>
                              </div>
                            </div>
                            <div className="flex-1 px-2">
                              <div className="truncate w-32">
                                <span className="text-gray-300">
                                  {friend.name}
                                </span>
                              </div>
                              <div>
                                <small className="text-gray-400">
                                  {friend.lastMessage?.message || ""}
                                </small>
                              </div>
                            </div>
                            <div className="flex-2 text-right">
                              <div>
                                <small className="text-gray-500">
                                  {friend.lastMessage === null ||
                                  friend.lastMessage === undefined
                                    ? ""
                                    : formatDate(friend.lastMessage?.time)}
                                </small>
                              </div>
                              <div>
                                {friend.unreadCount !== 0 && (
                                  <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                    {friend.unreadCount}
                                  </small>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    <div className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-gray-800 mb-4 rounded p-4 flex shadow-md">
                      <div className="flex-2">
                        <div className="w-12 h-12 relative">
                          <img
                            className="w-12 h-12 rounded-full mx-auto"
                            src="../resources/profile-image.png"
                            alt="chat-user"
                          />
                          <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-gray-800"></span>
                        </div>
                      </div>
                      <div className="flex-1 px-2">
                        <div className="truncate w-32">
                          <span className="text-gray-300">Ryann Remo</span>
                        </div>
                        <div>
                          <small className="text-gray-400">Yea, Sure!</small>
                        </div>
                      </div>
                      <div className="flex-2 text-right">
                        <div>
                          <small className="text-gray-500">15 April</small>
                        </div>
                        <div>
                          <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                            23
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-gray-800 mb-4 rounded p-4 flex shadow-md">
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
                        <div className="truncate w-32">
                          <span className="text-gray-300">Karp Bonolo</span>
                        </div>
                        <div>
                          <small className="text-gray-400">Yea, Sure!</small>
                        </div>
                      </div>
                      <div className="flex-2 text-right">
                        <div>
                          <small className="text-gray-500">15 April</small>
                        </div>
                        <div>
                          <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                            10
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-gray-800 mb-4 rounded p-4 flex shadow-md ">
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
                        <div className="truncate w-32">
                          <span className="text-gray-300">
                            Mercedes Yemelyan
                          </span>
                        </div>
                        <div>
                          <small className="text-gray-400">Yea, Sure!</small>
                        </div>
                      </div>
                      <div className="flex-2 text-right">
                        <div>
                          <small className="text-gray-500">15 April</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {id && friends.length !== 0 && (
                  <ChatArea roomId={id} friends={friends} user={user} />
                )}
              </div>
            </div>
            <span className="absolute bottom-2 -translate-x-1/2 left-1/2 text-xs text-gray-300">
              Credits for frontend :
              <a
                href="https://github.com/envomer/tailwindcss-chat/tree/master"
                className="text-blue-600 hover:underline"
              >
                {" "}
                To Github Repo
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCmp;
