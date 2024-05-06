import { useAppDispatch, useAppSelector } from "../../hooks";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Message } from "../../libs/chat";
import ChatMessages from "./ChatMessages";
import JoinChannelButton from "./JoinChannelButton";
import {
  getIsOwnerSync,
  getUserHasJoinedSync,
  getChannelById,
} from "../../libs";
import { setCurrentChannel } from "../../store/channelSlice";

const socket = io(import.meta.env.VITE_ENDPOINT);

const ChatBox = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const userHasJoined = useAppSelector((state) => state.channel.userHasJoined);
  const isOwner = useAppSelector((state) => state.server.isOwner);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );
  const currentWalletAddress = useAppSelector(
    (state) => state.account.currentWalletAddress
  );
  const dispatch = useAppDispatch();

  const onSendMessage = (messageObj: Message) => {
    socket.emit("sendMessage", messageObj);
  };

  const handleOnJoin = (channelId: string) => {
    if (currentServer) {
      const channel = getChannelById(channelId, currentServer);
      dispatch(setCurrentChannel(channel));
      joinChannel();
    }
  };

  const joinChannel = async () => {
    if (!currentServer || !currentChannel) {
      return;
    }
    socket.emit("join", {
      server: currentServer.address,
      channel: currentChannel.channelId,
      account: currentWalletAddress,
    });
  };
  const leaveChannel = async () => {
    if (!currentServer || !currentChannel) {
      return;
    }
    socket.emit("leave", {
      server: currentServer.address,
      channel: currentChannel.channelId,
      account: currentWalletAddress,
    });
  };

  const onRoomChanged = async () => {
    if (currentServer && currentChannel) {
      joinChannel();
      socket.on("connect", () => {
        socket.emit("get messages");
      });

      socket.on(
        "newMessage",
        ({ account, text }: { account: string; text: string }) => {
          console.log(`new message from ${account}: ${text}`);
        }
      );

      socket.on("messagesFromChannel", (messages: Message[]) => {
        console.log("client new message", messages);
        setMessages(messages);
      });

      socket.on("get messages", (messages: Message[]) => {
        setMessages(messages);
      });
    }
  };

  useEffect(() => {
    if (currentServer && currentChannel) {
      const isOwnerSync = getIsOwnerSync(currentServer, currentWalletAddress);
      const hasJoinedSync = getUserHasJoinedSync(
        currentChannel,
        currentWalletAddress
      );
      if (isOwnerSync || hasJoinedSync) {
        onRoomChanged();
        return () => {
          leaveChannel();
          socket.off();
        };
      }
    }
  }, [currentChannel, currentWalletAddress]);

  return (
    <section className="flex-grow">
      {(isOwner || userHasJoined) && currentChannel && (
        <ChatMessages
          messages={messages.filter(
            (message) =>
              message.server.toLocaleLowerCase() ===
                currentServer?.address?.toLocaleLowerCase() &&
              message.channel === currentChannel?.channelId
          )}
          channel={currentChannel}
          onSendMessage={onSendMessage}
        />
      )}
      {!isOwner && !userHasJoined && currentChannel && (
        <JoinChannelButton
          server={currentServer}
          channel={currentChannel}
          onJoin={handleOnJoin}
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
