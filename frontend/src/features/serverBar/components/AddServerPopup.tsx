import Popup from "../../../components/Popup";
import arrowRight from "../../../assets/arrow-right-4D545E.svg";
import closeActive from "../../../assets/close-DBDEE1.svg";
import closeIdle from "../../../assets/close-73767D.svg";
import React, { useState } from "react";
const AddServerPopup = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [onClose, setOnClose] = useState(false);
  const createServer = () => {
    console.log("create server");
  };
  const joinServer = () => {
    console.log("join server");
  };
  return (
    <Popup show={show} setShow={setShow}>
      <div className="relative bg-[#313338] w-[442px] rounded-md">
        <button
          onClick={() => {
            setShow(false);
          }}
          className="absolute right-5 top-5"
        >
          <img
            onMouseEnter={() => {
              setOnClose(true);
            }}
            onMouseLeave={() => {
              setOnClose(false);
            }}
            width={18}
            height={18}
            src={onClose ? closeActive : closeIdle}
            alt="close"
          />
        </button>

        <div className="flex flex-col items-center text-center pt-[24px] px-[18px] pb-[10px]">
          <h1 className="text-2xl font-bold mb-1">Create Your Server</h1>
          <p className="text-[#b2b7be] mb-5">
            Your server is where you and you friends hang out. Make yours and
            start talking
          </p>
          <button
            className="text-[#d7dadd] font-bold flex items-center justify-between w-full border border-[#3e4046] rounded-md p-4 hover:bg-[#393c41] transition-colors ease-in-out"
            onClick={createServer}
          >
            <span>Create My Own</span>
            <img width={16} height={16} src={arrowRight} alt="" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31]">
          <p className="text-xl font-semibold mb-2">Have an invite already?</p>
          <button
            className="bg-[#4e5058] hover:bg-[#6d6f78] w-full rounded-sm py-2 font-semibold text-[#d7dadd] transition-colors ease-in-out"
            onClick={joinServer}
          >
            Join a Server
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default AddServerPopup;
