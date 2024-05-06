import { useState, FormEvent } from "react";
import { Channel } from "../../libs";
import { Message } from "../../libs/chat";
import { useAppSelector } from "../../hooks";
const ChatMessages = ({
  messages,
  channel,
  onSendMessage,
}: {
  messages: Message[];
  channel: Channel;
  onSendMessage: (messageObj: Message) => void;
}) => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const account = useAppSelector((state) => state.account.currentWalletAddress);
  const [userInput, setUserInput] = useState("");
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    const messageObj: Message = {
      server: `${currentServer?.address}`,
      channel: `${channel.channelId}`,
      account: account,
      text: userInput,
    };

    if (userInput) {
      onSendMessage(messageObj);
    }

    setUserInput("");
  };

  return (
    <section className="relative p-4 h-full">
      <div className="h-full flex flex-col justify-end pb-[80px]">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col items-start py-2">
            <span className="text-[#3493d0] font-semibold">
              {message.account}
            </span>
            <span className="text-[#d4d2d8] text-[15px]">{message.text}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#313338] absolute left-0 bottom-0 right-0 px-4 pb-6 pt-2">
        <form onSubmit={sendMessage}>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="bg-[#383a40] p-3 text-[#d4d2d8] outline-none w-full rounded-md"
            type="text"
            placeholder={`Message # ${channel.channelName}`}
          />
        </form>
      </div>
    </section>
  );
};

export default ChatMessages;
