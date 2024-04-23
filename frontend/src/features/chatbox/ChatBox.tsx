import { useAppSelector } from "../../hooks";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Message } from "../../libs/chat";
import ChatMessages from "./ChatMessages";
import JoinChannelButton from "./JoinChannelButton";

const socket = io("ws://localhost:3030");

const ChatBox = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const userHasJoined = useAppSelector((state) => state.channel.userHasJoined);
  const isOwner = useAppSelector((state) => state.server.isOwner);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("get messages");
    });

    socket.on("new message", (messages: Message[]) => {
      setMessages(messages);
    });

    socket.on("get messages", (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socket.off("connect");
      socket.off("new message");
      socket.off("get messages");
    };
  }, []);

  return (
    <section className="flex-grow">
      {(isOwner || userHasJoined) && currentChannel && (
        <ChatMessages
          messages={messages.filter(
            (message) =>
              message.channel.toLocaleLowerCase() ===
              `${currentServer?.address?.toLocaleLowerCase()}-${
                currentChannel.channelId
              }`
          )}
          channel={currentChannel}
        />
      )}
      {!isOwner && !userHasJoined && currentChannel && (
        <JoinChannelButton server={currentServer} channel={currentChannel} />
      )}
      {currentChannel === null && (
        <div className="w-full h-full flex items-center justify-center">
          <p>Select a Channel to Chat</p>
        </div>
      )}
    </section>
  );
};

export default ChatBox;
