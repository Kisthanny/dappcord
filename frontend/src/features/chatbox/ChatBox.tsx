import { useAppDispatch, useAppSelector } from "../../hooks";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Message } from "../../libs/chat";
import ChatMessages from "./ChatMessages";
import JoinChannelButton from "./JoinChannelButton";
import { setChatRoomId, setLoading } from "../../store/chatSlice";
import { MessageObj, allMessages, fetchChat, sendMessage } from "../../api";

const socket = io(import.meta.env.VITE_ENDPOINT);

const ChatBox = () => {
  const [messages, setMessages] = useState([] as Message[]);
  const roomId = useAppSelector((state) => state.chat.roomId);
  const isLoading = useAppSelector((state) => state.chat.loading);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );
  const currentWalletAddress = useAppSelector(
    (state) => state.account.currentWalletAddress
  );
  const dispatch = useAppDispatch();

  const onSendMessage = async (text: string) => {
    const data = await sendMessage({
      content: text,
      chatId: roomId,
    });
    socket.emit("newMessage", data);
    appendMessage(data);
  };

  const fetchNewChatRoom = async () => {
    if (currentServer && currentChannel) {
      dispatch(setLoading(true));
      const newRoomId = await fetchChat({
        server: currentServer.address,
        channel: currentChannel.channelId,
      });
      dispatch(setChatRoomId(newRoomId));
    }
  };

  const onRoomChanged = async () => {
    if (!roomId) {
      dispatch(setLoading(false));
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
    dispatch(setLoading(false));
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
      {!isLoading && roomId && currentChannel && (
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
      {!isLoading && !roomId && currentChannel && (
        <JoinChannelButton server={currentServer} channel={currentChannel} />
      )}
      {!isLoading && currentChannel === null && (
        <div className="w-full h-full flex items-center justify-center">
          <p>Select a Channel to Chat</p>
        </div>
      )}
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          Loading...
        </div>
      )}
    </section>
  );
};

export default ChatBox;
