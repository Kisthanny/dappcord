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
import { MessageObj, allMessages, fetchChat, sendMessage } from "../../api";

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

  const onSendMessage = async (messageObj: Message) => {
    const data = await sendMessage({
      content: messageObj.text,
      chatId: roomId,
    });
    socket.emit("newMessage", data);
    appendMessage(data);
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
    if (!roomId) {
      return;
    }
    socket.emit("join", { user: currentWalletAddress, roomId });

    const response = await allMessages(roomId);
    const messageList = response.map((o) => ({
      server: o.chat.server.address,
      channel: o.chat.channel,
      account: o.sender.address,
      text: o.content,
      timestamp: new Date(o.createdAt).getTime(),
    }));
    setMessages(messageList);
  };

  useEffect(() => {
    onRoomChanged();
    return () => {
      if (!roomId) {
        return;
      }
      socket.emit("leave", { user: currentWalletAddress, roomId });
    };
  }, [roomId]);

  useEffect(() => {
    fetchNewChatRoom();
  }, [currentServer, currentChannel]);

  useEffect(() => {
    const listener = (newMessage: MessageObj) => {
      appendMessage(newMessage);
    };
    socket.on("message recieved", listener);
    return () => {
      socket.off("message recieved", listener);
    };
  }, []);

  const appendMessage = (message: MessageObj) => {
    const timestamp = new Date(message.createdAt).getTime();
    const newMessageObj: Message = {
      server: message.chat.server.address,
      channel: message.chat.channel,
      account: message.sender.address,
      text: message.content,
      timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
  };

  useEffect(() => {
    setMessages(messages.sort((a, b) => a.timestamp - b.timestamp));
  }, [messages]);

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
