import ChannelsBar from "./features/channelsBar/ChannelsBar";
import ChatBox from "./features/chatbox/ChatBox";
import ServerBar from "./features/serverBar/ServerBar";
function App() {
  return (
    <main className="flex w-screen h-screen bg-[#313338] text-[#f2f3f5]">
      <ServerBar />
      <ChannelsBar />
      <ChatBox />
    </main>
  );
}

export default App;
