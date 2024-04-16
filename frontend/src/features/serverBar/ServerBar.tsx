import { useEffect } from "react";
import AddIcon from "./components/AddIcon";
import ServerIcon from "./components/ServerIcon";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addServer } from "./serverSlice";
import { ethers } from "ethers";

const ServerBar = () => {
  const dispatch = useAppDispatch();
  // get saved serverList
  const getSavedServerList: () => Promise<string[]> = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          "0x8464135c8F25Da09e49BC8782676a84730C318bC",
          "0x663F3ad617193148711d28f5334eE4Ed07016602",
          "0x057ef64E23666F000b34aE31332854aCBd1c8544",
        ]);
      }, 200);
    });
  };

  const getContract = async () => {
    const ethereum = window.ethereum;
    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      // console.log({ accounts });
    }
  };

  const onMounted = async () => {
    const serverList = await getSavedServerList();
    for (let i = 0; i < serverList.length; i++) {
      await getContract();
    }
  };

  useEffect(() => {
    onMounted();
  }, []);
  return (
    <section className="bg-[#1e1f22] h-full w-[73px]">
      <ul>
        <li>
          <AddIcon />
        </li>
        <li>
          <ServerIcon name="KK's Server" symbol="K" />
        </li>
      </ul>
    </section>
  );
};

export default ServerBar;
