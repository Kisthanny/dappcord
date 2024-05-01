import { showPopup, closePopup, CloseIcon } from "../../../components/Popup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { BigNumberish, ethers } from "ethers";
import { getServerContract, getSigner } from "../../../libs";
import { updateServer } from "../../../store/serverSlice";
import MyInput from "../../../components/MyInput";
const voiceIcon = (size: number) => (
  <svg
    className="icon flex-shrink-0"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="13560"
    width={size}
    height={size}
  >
    <path
      d="M640 181.333333c0-46.037333-54.357333-70.4-88.746667-39.850666L359.552 311.850667a32 32 0 0 1-21.248 8.106666H181.333333A96 96 0 0 0 85.333333 415.957333v191.872a96 96 0 0 0 96 96h157.013334a32 32 0 0 1 21.248 8.106667l191.616 170.410667c34.389333 30.549333 88.789333 6.144 88.789333-39.850667V181.333333z m170.325333 70.272a32 32 0 0 1 44.757334 6.698667A424.917333 424.917333 0 0 1 938.666667 512a424.96 424.96 0 0 1-83.626667 253.696 32 32 0 0 1-51.413333-38.058667A360.917333 360.917333 0 0 0 874.666667 512a360.917333 360.917333 0 0 0-71.04-215.637333 32 32 0 0 1 6.698666-44.757334zM731.434667 357.12a32 32 0 0 1 43.392 12.928c22.869333 42.24 35.84 90.666667 35.84 141.994667a297.514667 297.514667 0 0 1-35.84 141.994666 32 32 0 0 1-56.32-30.464c17.92-33.152 28.16-71.082667 28.16-111.530666s-10.24-78.378667-28.16-111.530667a32 32 0 0 1 12.928-43.392z"
      fill="inherit"
      p-id="13561"
    ></path>
  </svg>
);
const textIcon = (size: number) => (
  <svg
    className="icon flex-shrink-0"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="10367"
    width={size}
    height={size}
  >
    <path
      d="M870.4 448a64 64 0 0 0 0-128h-114.56l26.88-148.48a64 64 0 0 0-126.08-23.04l-32 171.52h-156.8l26.88-148.48a64 64 0 0 0-126.08-23.04l-32 171.52H198.4a64 64 0 1 0 0 128h116.16l-23.36 128H153.6a64 64 0 0 0 0 128h114.56l-26.88 148.48a64 64 0 1 0 126.08 23.04l32-171.52h157.76l-26.88 148.48a64 64 0 1 0 126.08 23.04l32-171.52h137.28a64 64 0 1 0 0-128h-116.16l23.36-128z m-291.2 128h-157.76l23.36-128h157.76z"
      fill="inherit"
      p-id="10368"
    ></path>
  </svg>
);
const radioSelect = (
  <svg
    className="icon flex-shrink-0"
    viewBox="0 0 1040 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="14841"
    width="32"
    height="32"
  >
    <path
      d="M509.92 176C325.504 176 176 325.504 176 509.92c0 184.416 149.504 333.92 333.92 333.92 184.416 0 333.92-149.504 333.92-333.92C843.84 325.504 694.32 176 509.92 176z m0 48c157.904 0 285.92 128 285.92 285.92 0 157.904-128.016 285.92-285.92 285.92C352 795.84 224 667.808 224 509.92 224 352 352 224 509.92 224z m0 96C405.024 320 320 405.024 320 509.92c0 104.88 85.024 189.92 189.92 189.92 104.88 0 189.92-85.04 189.92-189.92 0-104.896-85.04-189.92-189.92-189.92z"
      fill="#ffffff"
      p-id="14842"
    ></path>
  </svg>
);
const radioUnselect = (
  <svg
    className="icon flex-shrink-0"
    viewBox="0 0 1040 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="15003"
    width="32"
    height="32"
  >
    <path
      d="M509.92 843.84C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m0-48c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z"
      fill="#dbdee1"
      p-id="15004"
    ></path>
  </svg>
);
const AddChannel = ({
  defaultCategoryId,
}: {
  defaultCategoryId: BigNumberish;
}) => {
  const dispatch = useAppDispatch();
  const [categoryId, setCategoryId] = useState(defaultCategoryId.toString());
  const [channelType, setChannelType] = useState(0);
  const [channelName, setChannelName] = useState("");
  const [channelTopic, setChannelTopic] = useState("");
  const [channelFee, setChannelFee] = useState(0);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const categoryList = currentServer?.categoryList || [];
  const createChannel = async () => {
    if (currentServer) {
      const contract = await getServerContract(currentServer.address);
      const signer = await getSigner();
      const transaction = await contract
        .connect(signer)
        .createChannel(
          channelName,
          channelTopic,
          channelType,
          ethers.parseEther(channelFee.toString()),
          categoryId
        );
      await transaction.wait();
      await dispatch(updateServer(currentServer.address));
      closePopup();
    }
  };

  return (
    <div className="relative bg-[#313338] w-[472px] rounded-md">
      <CloseIcon />

      <div className="flex flex-col items-center text-center pt-[24px] px-[14px] pb-[10px]">
        <h1 className="text-2xl font-bold mb-1">Create Channel</h1>
        <h4 className="text-left w-full text-xs font-bold text-[#b5bac1] mb-2">
          SELECT CATEGORY
        </h4>
        <div className="w-full text-xs bg-[#1e1f22] p-2 rounded-md mb-2">
          <select
            name="category"
            id="new-channel-select-category"
            className="w-full bg-transparent text-[#dbdee1] outline-none"
            defaultValue={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
            }}
          >
            {categoryList.map((category) => (
              <option
                className="bg-[#2b2d31]"
                key={category.categoryId}
                value={category.categoryId}
              >
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <h4 className="text-left w-full text-xs font-bold text-[#b5bac1] mb-2">
          CHANNEL TYPE
        </h4>
        <button
          className={`mb-2 text-[#d2d5d8] flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 ${
            channelType === 0
              ? "bg-[#43444b] fill-[#b4b4b7]"
              : "bg-[#2b2d31] hover:bg-[#393c41] fill-[#7e8288] hover:fill-[#9a9da1]"
          } transition-colors ease-in-out`}
          onClick={setChannelType.bind(null, 0)}
        >
          {textIcon(28)}
          <div className="flex flex-col items-start text-left">
            <span className="font-semibold">Text</span>
            <p className="text-[#b5bac1] text-sm text-nowrap">
              Send messages, Images, GIFs, emoji, opinions, and puns
            </p>
          </div>
          {channelType === 0 ? radioSelect : radioUnselect}
        </button>
        <button
          className={`mb-2 text-[#d2d5d8] flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 ${
            channelType === 1
              ? "bg-[#43444b] fill-[#b4b4b7]"
              : "bg-[#2b2d31] hover:bg-[#393c41] fill-[#7e8288] hover:fill-[#9a9da1]"
          } transition-colors ease-in-out`}
          onClick={setChannelType.bind(null, 1)}
        >
          {voiceIcon(28)}
          <div className="flex flex-col items-start text-left">
            <span className="font-semibold">Voice</span>
            <p className="text-[#b5bac1] text-sm text-nowrap">
              Hang out together with voice, video, and screen share
            </p>
          </div>
          {channelType === 1 ? radioSelect : radioUnselect}
        </button>
        <MyInput
          type="text"
          placeholder="new-channel"
          name="CHANNEL NAME"
          className="bg-black"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <MyInput
          type="text"
          placeholder="it's-about"
          name="CHANNEL TOPIC"
          className="bg-black"
          value={channelTopic}
          onChange={(e) => setChannelTopic(e.target.value)}
        />
        <MyInput
          type="number"
          name="CHANNEL FEE"
          className="bg-black"
          value={channelFee}
          onChange={(e) => setChannelFee(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center justify-end gap-6 pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31]">
        <button className="font-semibold" onClick={closePopup}>
          Cancel
        </button>
        <button
          className="text-white bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a5] px-4 rounded-sm py-2 font-semibold transition-colors ease-in-out"
          onClick={createChannel}
        >
          Create Channel
        </button>
      </div>
    </div>
  );
};

const showAddChannelPop = (defaultCategoryId: BigNumberish): void => {
  showPopup(<AddChannel defaultCategoryId={defaultCategoryId} />);
};

export default showAddChannelPop;
