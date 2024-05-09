import AddIcon from "./components/AddIcon";
import ServerIcon from "./components/ServerIcon";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useEffect } from "react";
import { setIsOwner, setServerList } from "../../store/serverSlice";
import { setUserHasJoined } from "../../store/channelSlice";
import { getServerCollectionByUser } from "../../api";
import { getServers } from "../../libs";
import { signIn } from "../../libs/user";

const ServerBar = () => {
  const dispatch = useAppDispatch();

  const serverList = useAppSelector((state) => state.server.serverList);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentWalletAddress = useAppSelector(
    (state) => state.account.currentWalletAddress
  );
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );

  const initServerListByUser = async () => {
    if (!currentWalletAddress) {
      return;
    }
    await signIn(currentWalletAddress);
    const collection = await getServerCollectionByUser(currentWalletAddress);
    const servers = await getServers(collection);
    dispatch(setServerList(servers));
  };

  useEffect(() => {
    initServerListByUser();
  }, [currentWalletAddress]);

  useEffect(() => {
    if (currentServer) {
      dispatch(
        setIsOwner(
          currentWalletAddress.toLocaleLowerCase() ===
            currentServer.owner.toLocaleLowerCase()
        )
      );
    }
  }, [currentServer, currentWalletAddress]);

  useEffect(() => {
    if (currentServer && currentChannel) {
      dispatch(
        setUserHasJoined({
          serverAddress: currentServer?.address,
          channelId: currentChannel?.channelId,
          userAddress: currentWalletAddress,
        })
      );
    }
  }, [currentServer, currentChannel, currentWalletAddress]);
  return (
    <section className="bg-[#1e1f22] h-full w-[73px]">
      <ul>
        {serverList.map((server) => (
          <li key={server.address}>
            <ServerIcon server={server} />
          </li>
        ))}
        <li>
          <AddIcon />
        </li>
      </ul>
    </section>
  );
};

export default ServerBar;
