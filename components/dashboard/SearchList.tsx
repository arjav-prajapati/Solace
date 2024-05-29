import { UserPlus } from "lucide-react";
import React, { FC } from "react";

interface searchListProps {
  //props
  list: {
    name: string;
  }[];
  isLoading: boolean;
}

const SearchList: FC<searchListProps> = ({ list, isLoading }) => {
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
                <div className="flex items-center hover:bg-gray-700 p-1 rounded-full">
                  <UserPlus size={22} />
                </div>
              </div>
              <hr className="w-full bg-gray-700" />
            </div>
          ))
        )}
        <div className="flex flex-col py-2 px-2 rounded-md cursor-pointer gap-3">
          <div className="flex flex-row justify-between">
            <div className="flex items-center">
              <div className="text-white">Name</div>
            </div>
            <div className="flex items-center hover:bg-gray-700 p-1 rounded-full">
              <UserPlus size={22} />
            </div>
          </div>
          <hr className="w-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default SearchList;
