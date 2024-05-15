const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { notFound, errorHandler } = require("../middleware/errorMiddleware");

const serverRouter = require("../router/serverRouter");
const userRouter = require("../router/userRouter");
const chatRouter = require("../router/chatRouter");
const messageRoute = require("../router/messageRouter");

dotenv.config();

const connectDB = require("../config/db");
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

// 使用 CORS 中间件
app.use(
  cors({
    origin: "*", // 你的前端域名
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is up and running");
});

app.use("/api/server", serverRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server has started on port ${PORT}`)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_HOST, // 你的前端域名
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ user, roomId }) => {
    socket.join(roomId);
    console.log(`User ${user.slice(-4)} Joined Room: ${roomId.slice(-4)}`);
  });

  socket.on("leave", ({ user, roomId }) => {
    socket.leave(roomId);
    console.log(`User ${user.slice(-4)} Leave Room: ${roomId.slice(-4)}`);
  });

  socket.on("newMessage", (newMessageRecieved) => {
    console.log("newMessage");
    const chat = newMessageRecieved.chat;
    if (!chat._id) {
      console.log("chat._id not defined");
      return;
    }
    console.log("should emit");
    socket.in(chat._id).emit("message recieved", newMessageRecieved);
  });

  socket.on("disconnect", () => {
    console.log("User had left!!!");
  });
});

module.exports = app;
