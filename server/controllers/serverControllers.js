const asyncHandler = require("express-async-handler");
const Server = require("../models/serverModel");
const { getServerFallback } = require("./fallback");

const addServer = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    res.status(400);
    throw new Error("missing argument");
  }

  const server = await getServerFallback(address);

  req.user.servers.push(server._id);
  await req.user.save();

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
  const server = await getServerFallback(address);
  res.send(server);
});

module.exports = { addServer, getServers, getServerByAddress };
