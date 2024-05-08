const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    serverAddress: { type: String, trim: true },
    channelId: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
