import Popup from "../../../components/Popup";
import arrowRight from "../../../assets/arrow-right-4D545E.svg";
import closeActive from "../../../assets/close-DBDEE1.svg";
import closeIdle from "../../../assets/close-73767D.svg";
import React, { useEffect, useState } from "react";
import { getServerContract } from "../libs";
import { useAppDispatch } from "../../../hooks";
import { addServer } from "../serverSlice";
export const SERVER_EXAMPLES = [
  "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "0x8464135c8F25Da09e49BC8782676a84730C318bC",
  "0x663F3ad617193148711d28f5334eE4Ed07016602",
  "0x057ef64E23666F000b34aE31332854aCBd1c8544",
];
export enum Step {
  "CREATE_YOUR_SERVER" = "Create-Your-Server",
  "CUSTOMIZE_YOUR_SERVER" = "Customize-Your-Server",
  "JOIN_A_SERVER" = "Join-a-Server",
}
const AddServerPopup = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(Step.CREATE_YOUR_SERVER);
  const [onClose, setOnClose] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverSymbol, setServerSymbol] = useState("");
  const [serverAddress, setServerAddress] = useState("");
  const [inviteLinkError, setInviteLinkError] = useState("");
  const createServer = () => {
    console.log("createServer");
  };

  const handleJoin = async () => {
    const res = await getServerContract(serverAddress);
    if (res.code === 0) {
      setInviteLinkError(res.message as string);
    } else {
      setInviteLinkError("");
      dispatch(addServer(serverAddress));
      setShow(false);
    }
  };
  useEffect(() => {
    setStep(Step.CREATE_YOUR_SERVER);
  }, [show]);
  useEffect(() => {
    setInviteLinkError("");
  }, [serverAddress]);
  return (
    <Popup show={show} setShow={setShow}>
      {step === Step.CREATE_YOUR_SERVER && (
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
              onClick={() => {
                setStep(Step.CUSTOMIZE_YOUR_SERVER);
              }}
            >
              <span>Create My Own</span>
              <img width={16} height={16} src={arrowRight} alt="" />
            </button>
          </div>
          <div className="flex flex-col items-center text-center pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31]">
            <p className="text-xl font-semibold mb-2">
              Have an invite already?
            </p>
            <button
              className="bg-[#4e5058] hover:bg-[#6d6f78] w-full rounded-sm py-2 font-semibold text-[#d7dadd] transition-colors ease-in-out"
              onClick={() => {
                setStep(Step.JOIN_A_SERVER);
              }}
            >
              Join a Server
            </button>
          </div>
        </div>
      )}
      {step === Step.CUSTOMIZE_YOUR_SERVER && (
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
            <h1 className="text-2xl font-bold mb-1">Customize Your Server</h1>
            <p className="text-[#b2b7be] mb-5">
              Give your new server a personality with a name and a symbol. You
              can not change it after creating.
            </p>
            <div className="w-full text-[#b2b7be] mb-3">
              <h3 className="text-xs font-bold text-left w-full mb-2">
                SERVER NAME
              </h3>
              <input
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                type="text"
                className="w-full bg-[#1e1f22] rounded-sm py-2 px-3 focus:outline-none"
                placeholder="Your server"
              />
            </div>
            <div className="w-full text-[#b2b7be] mb-3">
              <h3 className="text-xs font-bold text-left w-full mb-2">
                SERVER SYMBOL
              </h3>
              <input
                value={serverSymbol}
                onChange={(e) => setServerSymbol(e.target.value)}
                type="text"
                className="w-full bg-[#1e1f22] rounded-sm py-2 px-3 focus:outline-none"
                placeholder="Your symbol"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31] text-sm font-semibold">
            <button
              className="text-[#b2b7be] py-2"
              onClick={() => {
                setStep(Step.CREATE_YOUR_SERVER);
              }}
            >
              Back
            </button>
            <button
              className="bg-[#5865f2] hover:bg-[#4752c4] py-2 px-7 rounded-sm"
              onClick={createServer}
            >
              Create
            </button>
          </div>
        </div>
      )}
      {step === Step.JOIN_A_SERVER && (
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
            <h1 className="text-2xl font-bold mb-1">Join a Server</h1>
            <p className="text-[#b2b7be] mb-5">
              Enter an invite below to join an existing server
            </p>
            <div className="w-full text-[#b2b7be] mb-3">
              <h3 className="text-xs font-bold text-left w-full mb-2">
                INVITE LINK
              </h3>
              <input
                type="text"
                value={serverAddress}
                className="w-full bg-[#1e1f22] rounded-sm py-2 px-3 focus:outline-none"
                placeholder="Server address"
                onChange={(e) => {
                  setServerAddress(e.target.value);
                }}
              />
              {inviteLinkError && (
                <p className="text-red-800 text-left text-sm font-semibold">
                  {inviteLinkError}
                </p>
              )}
            </div>
            <h3 className="text-xs font-bold text-left w-full mb-2 text-[#b2b7be]">
              INVITES SHOULD LOOK LIKE
            </h3>
            <ul className="w-full flex flex-col items-start text-xs text-[#dbdcdf] gap-1 cursor-default">
              {SERVER_EXAMPLES.map((address) => (
                <li
                  key={address}
                  onClick={() => {
                    setServerAddress(address);
                  }}
                >
                  {address}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31] text-sm font-semibold">
            <button
              className="text-[#b2b7be] py-2"
              onClick={() => {
                setStep(Step.CREATE_YOUR_SERVER);
              }}
            >
              Back
            </button>
            <button
              className="bg-[#5865f2] hover:bg-[#4752c4] py-2 px-7 rounded-sm"
              onClick={handleJoin}
            >
              Join Server
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default AddServerPopup;
