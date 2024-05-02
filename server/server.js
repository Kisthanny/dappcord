const express = require("express");
const { Server } = require("socket.io");
const { generateRandomString } = require("./utils");

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

const messages = require("./messages");

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ server, channel, account }) => {
    socket.join(server);
    socket.join(channel);
  });

  socket.on(
    "new message",
    ({ serverAddress, channelId, accountAddress, text }) => {
      const id = generateRandomString(10);
      console.log("server new message", {
        id: id,
        channelId,
        serverAddress,
        accountAddress,
        text,
      });
      messages.addMessage({
        id: id,
        channelId,
        serverAddress,
        accountAddress,
        text,
      });

      const messagesFromChannel = messages.getMessagesFromChannel({
        serverAddress,
        channelId,
      });

      io.to(serverAddress)
        .to(channelId)
        .emit("messagesFromChannel", messagesFromChannel);
    }
  );

  socket.on("get message", () => {});

  socket.on("disconnect", () => {
    console.log("User had left!!!");
  });
});
