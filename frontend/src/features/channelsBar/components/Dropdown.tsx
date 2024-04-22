import cross from "@/assets/cross-C9C9CC.svg";
import arrowDown from "@/assets/arrow-down-C9C9CC.svg";
import createChannel from "../../../assets/create-channel-b5bac1.svg";
import createFolder from "../../../assets/create-folder-b5bac1.svg";
import { useState } from "react";
import { useAppSelector } from "../../../hooks";
import showAddCategoryPop from "./AddCategoryPopup";
import showAddChannelPop from "./AddChannelPopup";

const Dropdown = () => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const isOwner = useAppSelector((state) => state.server.isOwner);
  const [isExpanded, setIsExpanded] = useState(false);
  const closePopupListener = () => {
    setTimeout(() => {
      setIsExpanded(false);
      document.removeEventListener("mouseup", closePopupListener);
    });
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      document.addEventListener("mouseup", closePopupListener);
    }
  };
  const handleCreateChannel = () => {
    const categoryList = currentServer?.categoryList || [];
    if (!categoryList.length) {
      showAddCategoryPop();
      return;
    }
    showAddChannelPop(categoryList[0].categoryId);
  };
  return (
    <div className="absolute z-10 left-0 top-0 right-0 h-[50px]">
      <button
        disabled={currentServer === null || !isOwner}
        onClick={toggleExpand}
        className="w-full h-full border-b-[1px] border-[#1f2124] px-[18px] flex items-center justify-between hover:bg-[#35373c]"
      >
        <span className="font-semibold">
          {currentServer?.name || "Add Server to Chat"}
        </span>
        <img
          width={14}
          height={14}
          src={isExpanded ? cross : arrowDown}
          alt="expand"
        />
      </button>
      <div
        className={`${
          isExpanded ? "" : "hidden"
        } absolute w-full px-[16px] py-2`}
      >
        <ul className="bg-[#111214] px-2 py-2 rounded-md shadow-xl shadow-stone-900">
          <li className="">
            <button
              onClick={handleCreateChannel}
              className="w-full flex items-center justify-between py-2 px-2 rounded-sm hover:bg-[#4752c4] text-[#b5bac1] hover:text-[#f0f0f9]"
            >
              <span className="">Create Channel</span>
              <img
                width={18}
                height={18}
                src={createChannel}
                alt="createChannel"
              />
            </button>
          </li>
          <li className="">
            <button
              onClick={showAddCategoryPop}
              className="w-full flex items-center justify-between py-2 px-2 rounded-sm hover:bg-[#4752c4] text-[#b5bac1] hover:text-[#f0f0f9]"
            >
              <span className="">Create Category</span>
              <img
                width={18}
                height={18}
                src={createFolder}
                alt="createFolder"
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
