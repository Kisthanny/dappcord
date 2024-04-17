import { useEffect, useState } from "react";
import { getServerContract } from "../libs";
import Icon, { IconType } from "./Icon";
import { ethers } from "ethers";
import { setCurrentServer } from "../serverSlice";
import { useAppDispatch } from "../../../hooks";
const ServerIcon = ({ address }: { address: string }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
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

  return (
    <Icon
      type={IconType.TEXT}
      title={name}
      text={symbol}
      onClick={() => {
        dispatch(setCurrentServer(address));
      }}
    />
  );
};

export default ServerIcon;
