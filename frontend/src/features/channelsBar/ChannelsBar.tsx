import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import Channels from "./components/Channels";
import Dropdown from "./components/Dropdown";
import UserInfo from "./components/UserInfo";
import { getServerContract } from "../serverBar/libs";
import { ethers } from "ethers";
import AddChannelPopup from "./components/AddChannelPopup";
import { BigNumberish } from "ethers";

const ChannelsBar = () => {
  const [currentContract, setCurrentContract] = useState(
    null as unknown as ethers.Contract
  );
  const [showAddChannelPop, setShowAddChannelPop] = useState(false);
  const [addCategoryId, setAddCategoryId] = useState(0 as BigNumberish);
  const currentServerAddress = useAppSelector(
    (state) => state.server.currentServer
  );
  const fetchContract = async () => {
    const res = await getServerContract(currentServerAddress);
    if (res.code === 1) {
      setCurrentContract(res.data as ethers.Contract);
    }
  };
  useEffect(() => {
    fetchContract();
  }, [currentServerAddress]);
  return (
    <section className="relative w-[240px] bg-[#2b2d31]">
      <Dropdown contract={currentContract} />
      <Channels
        contract={currentContract}
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
