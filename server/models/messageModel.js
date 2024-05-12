const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
