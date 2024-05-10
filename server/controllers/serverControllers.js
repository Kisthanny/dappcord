const asyncHandler = require("express-async-handler");
const Server = require("../models/serverModel");
const User = require("../models/userModel");
const { getOwner, getSymbol, getName } = require("../blockChainApi/index");

const addServer = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    res.status(400);
    throw new Error("missing argument");
  }

  const serverExist = await Server.findOne({ address });
  if (serverExist) {
    res.status(400);
    throw new Error("Server already exists");
  }

  const [owner, symbol, name] = await Promise.all([
    getOwner.bind(null, address),
    getSymbol.bind(null, address),
    getName.bind(null, address),
  ]);

  const server = await Server.create({
    owner,
    address,
    name,
    symbol,
  });
  if (!server) {
    res.status(400);
    throw new Error("Failed to Add the Server");
  }

  let user = await User.findOne({ address: owner.toLocaleLowerCase() });
  if (!user) {
    user = await User.create({ address: owner.toLocaleLowerCase() });
  }

  user.servers.push(server._id);
  await user.save();

  res.status(201).json({
    _id: server._id,
    owner: server.owner,
    address: server.address,
    name: server.name,
    symbol: server.symbol,
  });
});

const getServers = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
  let servers;
  if (page && size) {
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const skip = (pageNumber - 1) * pageSize;

    servers = await Server.find().skip(skip).limit(pageSize);
  } else {
    servers = await Server.find().limit(4);
  }
  res.status(200).json(servers);
});

const getServerByAddress = asyncHandler(async (req, res) => {
  const { address } = req.params;
  const server = await Server.find({ address });
  res.send(server);
});

module.exports = { addServer, getServers, getServerByAddress };
