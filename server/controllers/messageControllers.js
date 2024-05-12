const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const { getAccess } = require("../blockChainApi/index");
const { getChatFallback } = require("./fallback");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.status(400);
    throw new Error("Missing argument");
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "address");
    message = await message.populate("chat", "server channel");
    res.json(message);
  } catch (error) {
    res.status(400);
    console.error(error);
    throw new Error("Failed to Add new Message");
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "address")
      .populate("chat", "server channel");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch Messages");
  }
});

module.exports = { sendMessage, allMessages };
