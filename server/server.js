const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
dotenv.config();

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();

app.use(router);

const server = app.listen(PORT, () =>
  console.log(`Server has started on port ${PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const messageRecord = require("./messages");

const getRoomId = (server, channel) => {
  return `${server.toLocaleLowerCase()}-${channel.toLocaleLowerCase()}`;
};

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ server, channel, account }) => {
    if (!server || !channel || !account) {
      return;
    }
    const roomId = getRoomId(server, channel);
    socket.join(roomId);
    console.log(`${account} join the room ${roomId}`);
  });

  socket.on("leave", ({ server, channel, account }) => {
    if (!server || !channel || !account) {
      return;
    }
    const roomId = getRoomId(server, channel);
    socket.leave(roomId);
    console.log(`${account} leave the room ${roomId}`);
  });

  socket.on("sendMessage", ({ server, channel, text, account }) => {
    const roomId = getRoomId(server, channel);
    messageRecord.addMessage({
      server,
      channel,
      account,
      text,
    });
    io.to(roomId).emit("newMessage", {
      account,
      text,
      history: messageRecord.history[roomId],
    });
    console.log(`${account}: ${text}`);
  });

  socket.on("getMessages", ({ server, channel }) => {
    socket.emit(
      "messageHistory",
      messageRecord.getMessagesFromRoom({ server, channel })
    );
  });

  socket.on("disconnect", () => {
    console.log("User had left!!!");
  });
});
