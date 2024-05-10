const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    server: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Server",
    },
    owner: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    channel: { type: String, trim: true },
    fee: { type: String, trim: true, default: "0" },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
