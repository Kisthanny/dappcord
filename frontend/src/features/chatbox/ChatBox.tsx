import { useAppSelector } from "../../hooks";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Message } from "../../libs/chat";
import ChatMessages from "./ChatMessages";
import JoinChannelButton from "./JoinChannelButton";
import { getSigner } from "../../libs";

const socket = io(import.meta.env.VITE_ENDPOINT);

const ChatBox = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const userHasJoined = useAppSelector((state) => state.channel.userHasJoined);
  const isOwner = useAppSelector((state) => state.server.isOwner);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );

  const onSendMessage = (messageObj: Message) => {
    socket.emit("new message", messageObj);
  };

  const joinChannel = async () => {
    const signer = await getSigner();
    socket.emit("join", {
      server: currentServer?.address,
      channel: currentChannel?.channelId,
      account: signer.address,
    });
  };

  useEffect(() => {
    joinChannel();
    socket.on("connect", () => {
      socket.emit("get messages");
    });

    socket.on("messagesFromChannel", (messages: Message[]) => {
      console.log("client new message", messages);
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
  }, [currentServer, currentChannel]);

  return (
    <section className="flex-grow">
      {(isOwner || userHasJoined) && currentChannel && (
        <ChatMessages
          messages={messages.filter(
            (message) =>
              message.serverAddress.toLocaleLowerCase() ===
                currentServer?.address?.toLocaleLowerCase() &&
              message.channelId === currentChannel?.channelId
          )}
          channel={currentChannel}
          onSendMessage={onSendMessage}
        />
      )}
      {!isOwner && !userHasJoined && currentChannel && (
        <JoinChannelButton
          server={currentServer}
          channel={currentChannel}
          onJoin={joinChannel}
        />
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
