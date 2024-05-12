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
import { setChatRoomId } from "../../store/chatSlice";
import { fetchChat } from "../../api";

const socket = io(import.meta.env.VITE_ENDPOINT);

const ChatBox = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const roomId = useAppSelector((state) => state.chat.roomId);
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

  const handleOnJoin = (channelId: string, chatRoomId: string) => {
    if (currentServer) {
      const channel = getChannelById(channelId, currentServer);
      dispatch(setCurrentChannel(channel));
      dispatch(setChatRoomId(chatRoomId));
    }
  };

  const fetchNewChatRoom = async () => {
    if (currentServer && currentChannel) {
      const newRoomId = await fetchChat({
        server: currentServer.address,
        channel: currentChannel.channelId,
      });
      dispatch(setChatRoomId(newRoomId));
    }
  };

  const onRoomChanged = async () => {
    console.log("join new chat room: ", roomId);
  };

  useEffect(() => {
    onRoomChanged();
  }, [roomId]);

  useEffect(() => {
    fetchNewChatRoom();
  }, [currentServer, currentChannel]);

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
