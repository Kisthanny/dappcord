import { useEffect } from "react";
import ChannelsBar from "./features/channelsBar/ChannelsBar";
import ChatBox from "./features/chatbox/ChatBox";
import ServerBar from "./features/serverBar/ServerBar";
import { useAppDispatch } from "./hooks";
import { setCurrentAddress } from "./components/accountSlice";
function App() {
  const dispatch = useAppDispatch();
  const handleAccountChanged = (accounts: string[]) => {
    dispatch(setCurrentAddress(accounts[0]));
  };
  const onMounted = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum === undefined) {
        throw new Error("Please install Metamask");
      }
      const result: string[] = await ethereum.request({
        method: "eth_accounts",
      });
      if (result.length) {
        dispatch(setCurrentAddress(result[0]));
      }

      ethereum.on("accountsChanged", handleAccountChanged);
    } catch (error) {}
  };
  useEffect(() => {
    onMounted();
  }, []);
  return (
    <main className="flex w-screen h-screen bg-[#313338] text-[#f2f3f5]">
      <ServerBar />
      <ChannelsBar />
      <ChatBox />
    </main>
  );
}

export default App;
