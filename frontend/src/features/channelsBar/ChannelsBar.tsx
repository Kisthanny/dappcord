import { useState } from "react";
import { useAppSelector } from "../../hooks";
import Channels from "./components/Channels";
import Dropdown from "./components/Dropdown";
import UserInfo from "./components/UserInfo";
import AddChannelPopup from "./components/AddChannelPopup";
import { BigNumberish } from "ethers";

const ChannelsBar = () => {
  const [showAddChannelPop, setShowAddChannelPop] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState(0 as BigNumberish);
  const currentServer = useAppSelector(
    (state) => state.server.currentServer
  );
  return (
    <section className="relative w-[240px] bg-[#2b2d31]">
      <Dropdown/>
      <Channels
        setAddCategoryId={(id) => {
          setAddCategoryId(id);
          setShowAddChannelPop(true);
        }}
      />
      <UserInfo />
      <AddChannelPopup
        show={showAddChannelPop}
        setShow={setShowAddChannelPop}
        categoryId={addCategoryId}
      />
    </section>
  );
};

export default ChannelsBar;
