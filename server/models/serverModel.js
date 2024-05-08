const mongoose = require("mongoose");

const serverModel = mongoose.Schema(
  {
    owner: { type: String, trim: true },
    address: { type: String, trim: true, unique: true },
    name: { type: String, trim: true },
    symbol: { type: String, trim: true },
  },
  {
    timestamp: true,
  }
);

const Server = mongoose.model("Server", serverModel);

module.exports = Server;
