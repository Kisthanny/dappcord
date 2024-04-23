import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Channels from "./components/Channels";
import Dropdown from "./components/Dropdown";
import UserInfo from "./components/UserInfo";
import { setCurrentChannel } from "../../store/channelSlice";

const ChannelsBar = () => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const firstChannel = currentServer?.categoryList?.[0]?.channelList?.[0];
    dispatch(setCurrentChannel(firstChannel || null));
  }, [currentServer]);
  return (
    <section className="relative w-[240px] bg-[#2b2d31]">
      <Dropdown />
      <Channels />
      <UserInfo />
    </section>
  );
};

export default ChannelsBar;
