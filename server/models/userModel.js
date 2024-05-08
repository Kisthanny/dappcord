const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    address: { type: String, trim: true, unique: true },
    servers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Server" }],
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
