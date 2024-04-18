import { useEffect, useState } from "react";
import { getServerContract } from "../libs";
import Icon, { IconType } from "./Icon";
import { ethers } from "ethers";
import { setCurrentServer } from "../serverSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
const ServerIcon = ({ address }: { address: string }) => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isCurrentServer, setIsCurrentServer] = useState(false);
  const initContract = async () => {
    const res = await getServerContract(address);
    if (res.code === 1) {
      const contract = res.data as ethers.Contract;
      setName(await contract.name());
      setSymbol(await contract.symbol());
    }
  };
  useEffect(() => {
    initContract();
  }, [address]);

  useEffect(() => {
    setIsCurrentServer(
      currentServer.toLocaleLowerCase() === address.toLocaleLowerCase()
    );
  }, [currentServer]);

  return (
    <Icon
      type={IconType.TEXT}
      title={name}
      text={symbol}
      idleBackground={isCurrentServer ? "#5865f2" : undefined}
      fixedSelected={isCurrentServer}
      onClick={() => {
        dispatch(setCurrentServer(address));
      }}
    />
  );
};

export default ServerIcon;
