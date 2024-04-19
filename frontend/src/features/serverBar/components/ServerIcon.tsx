import { useEffect, useState } from "react";
import { Server } from "../../../libs";
import Icon, { IconType } from "./Icon";
import { setCurrentServer } from "../../../store/serverSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks";
const ServerIcon = ({ server }: { server: Server }) => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const dispatch = useAppDispatch();
  const [isCurrentServer, setIsCurrentServer] = useState(false);

  useEffect(() => {
    setIsCurrentServer(
      currentServer?.address.toLocaleLowerCase() ===
        server.address.toLocaleLowerCase()
    );
  }, [currentServer]);

  return (
    <Icon
      type={IconType.TEXT}
      title={server.name}
      text={server.symbol}
      idleBackground={isCurrentServer ? "#5865f2" : undefined}
      fixedSelected={isCurrentServer}
      onClick={() => {
        dispatch(setCurrentServer(server.address));
      }}
    />
  );
};

export default ServerIcon;
