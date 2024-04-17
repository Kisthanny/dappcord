import cross from "@/assets/cross-C9C9CC.svg";
import arrowDown from "@/assets/arrow-down-C9C9CC.svg";
import createChannel from "../../../assets/create-channel-b5bac1.svg";
import createFolder from "../../../assets/create-folder-b5bac1.svg";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Dropdown = ({ contract }: { contract: ethers.Contract }) => {
  const [name, setName] = useState("");
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
  const fetchName = async () => {
    if (!contract || !contract.name) {
      return;
    }
    const name = await contract.name();
    setName(name);
  };
  useEffect(() => {
    fetchName();
  }, [contract]);
  return (
    <div className="absolute z-10 left-0 top-0 right-0 h-[50px]">
      <button
        onClick={toggleExpand}
        className="w-full h-full border-b-[1px] border-[#1f2124] px-[18px] flex items-center justify-between hover:bg-[#35373c]"
      >
        <span className="font-semibold">{name}</span>
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
              onClick={() => {
              }}
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
              onClick={() => {
              }}
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
