import { BigNumberish } from "ethers";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setCurrentChannel } from "../../../store/channelSlice";
import { useEffect, useState } from "react";
import { Channel as ChannelType } from "../../../libs";

export type Channel = {
  channelId: BigNumberish;
  channelName: string;
  channelTopic: string;
  channelType: BigNumberish;
  channelFee: BigNumberish;
  categoryId: BigNumberish;
  memberList: string[];
};
const voiceIcon = (
  <svg
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="13560"
    width="22"
    height="22"
  >
    <path
      d="M640 181.333333c0-46.037333-54.357333-70.4-88.746667-39.850666L359.552 311.850667a32 32 0 0 1-21.248 8.106666H181.333333A96 96 0 0 0 85.333333 415.957333v191.872a96 96 0 0 0 96 96h157.013334a32 32 0 0 1 21.248 8.106667l191.616 170.410667c34.389333 30.549333 88.789333 6.144 88.789333-39.850667V181.333333z m170.325333 70.272a32 32 0 0 1 44.757334 6.698667A424.917333 424.917333 0 0 1 938.666667 512a424.96 424.96 0 0 1-83.626667 253.696 32 32 0 0 1-51.413333-38.058667A360.917333 360.917333 0 0 0 874.666667 512a360.917333 360.917333 0 0 0-71.04-215.637333 32 32 0 0 1 6.698666-44.757334zM731.434667 357.12a32 32 0 0 1 43.392 12.928c22.869333 42.24 35.84 90.666667 35.84 141.994667a297.514667 297.514667 0 0 1-35.84 141.994666 32 32 0 0 1-56.32-30.464c17.92-33.152 28.16-71.082667 28.16-111.530666s-10.24-78.378667-28.16-111.530667a32 32 0 0 1 12.928-43.392z"
      fill="#80848e"
      p-id="13561"
    ></path>
  </svg>
);
const textIcon = (
  <svg
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="10367"
    width="22"
    height="22"
  >
    <path
      d="M870.4 448a64 64 0 0 0 0-128h-114.56l26.88-148.48a64 64 0 0 0-126.08-23.04l-32 171.52h-156.8l26.88-148.48a64 64 0 0 0-126.08-23.04l-32 171.52H198.4a64 64 0 1 0 0 128h116.16l-23.36 128H153.6a64 64 0 0 0 0 128h114.56l-26.88 148.48a64 64 0 1 0 126.08 23.04l32-171.52h157.76l-26.88 148.48a64 64 0 1 0 126.08 23.04l32-171.52h137.28a64 64 0 1 0 0-128h-116.16l23.36-128z m-291.2 128h-157.76l23.36-128h157.76z"
      fill="#80848e"
      p-id="10368"
    ></path>
  </svg>
);

const Channel = ({
  channel,
}: {
  channel: ChannelType;
}) => {
  const [isCurrent, setIsCurrent] = useState(false);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );
  const dispatch = useAppDispatch();
  const handleChannelClick = () => {
    dispatch(setCurrentChannel(Number(channel.channelId)));
  };
  useEffect(() => {
    if (!currentChannel) {
      dispatch(setCurrentChannel(Number(channel.channelId)));
      setIsCurrent(true);
    } else {
      setIsCurrent(Number(currentChannel) === Number(channel.channelId));
    }
  }, [currentChannel]);
  return (
    <button
      onClick={handleChannelClick}
      className={`flex items-center justify-between w-full px-2 py-1 rounded-md ${
        isCurrent
          ? "bg-[#404249] text-white"
          : "hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdec7]"
      }`}
    >
      <div className="flex items-center gap-2">
        {channel.channelType === 0 ? textIcon : voiceIcon}
        <span>{channel.channelName}</span>
      </div>
    </button>
  );
};

export default Channel;
