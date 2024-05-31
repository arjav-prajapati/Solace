import { UserMinus, UserPlus } from "lucide-react";
import React, { FC } from "react";
import MediumSpinner from "../global/MediumSpinner";

interface searchListProps {
  //props
  list: {
    name: string;
    isFriend: boolean;
    email: string;
  }[];
  isLoading: boolean;
  addFriend: (email: string) => void;
  removeFriend: (email: string) => void;
  isAddRemoveFriend: boolean;
}

const SearchList: FC<searchListProps> = ({
  list,
  isLoading,
  addFriend,
  removeFriend,
  isAddRemoveFriend,
}) => {
  return (
    <div className="w-full absolute z-50 top-12 left-2 rounded-lg">
      <div className="w-[92%] bg-gray-900 rounded-lg py-5 px-5 max-h-[300px] overflow-y-scroll edited-scroll-bar">
        {isLoading ? (
          <div className="text-white">Loading...</div>
        ) : (
          list.map((item, index) => (
            <div
              key={index}
              className="flex flex-col py-2 px-2 rounded-md cursor-pointer gap-3"
            >
              <div className="flex flex-row justify-between">
                <div className="flex items-center">
                  <div className="text-white">{item.name}</div>
                </div>
                {
                  // add or remove friend button
                  isAddRemoveFriend ? (
                    <MediumSpinner />
                  ) : item.isFriend ? (
                    <button
                      className="flex items-center hover:bg-gray-700 p-1 rounded-full"
                      onClick={() => removeFriend(item.email)}
                    >
                      <UserMinus size={22} />
                    </button>
                  ) : (
                    <button
                      className="flex items-center hover:bg-gray-700 p-1 rounded-full"
                      onClick={() => addFriend(item.email)}
                    >
                      <UserPlus size={22} />
                    </button>
                  )
                }
              </div>
              <hr className="w-full bg-gray-700" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchList;
