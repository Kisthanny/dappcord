import Channels from "./components/Channels";
import Dropdown from "./components/Dropdown";
import UserInfo from "./components/UserInfo";

const ChannelsBar = () => {
  return (
    <section className="relative w-[240px] bg-[#2b2d31]">
      <Dropdown />
      <Channels />
      <UserInfo />
    </section>
  );
};

export default ChannelsBar;
