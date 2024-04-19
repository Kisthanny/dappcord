import AddIcon from "./components/AddIcon";
import ServerIcon from "./components/ServerIcon";
import { useAppSelector } from "../../hooks";

const ServerBar = () => {
  const serverList = useAppSelector((state) => state.server.serverList);
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
