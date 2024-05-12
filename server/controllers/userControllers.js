const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Server = require("../models/serverModel");
const generateToken = require("../config/generateToken");
const { getUserFallback, getServerFallback } = require("./fallback");

const authUser = asyncHandler(async (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    res.status(400);
    throw new Error("missing argument");
  }

  if (!req.signatureVerified) {
    res.status(400);
    throw new Error("Invalid Signature");
  }

  const user = await getUserFallback(address);

  res.status(201).json({
    _id: user._id,
    address: user.address,
    token: generateToken(user._id),
  });
});

const addServerCollection = asyncHandler(async (req, res) => {
  const { server } = req.body;

  if (!server) {
    res.status(400);
    throw new Error("missing argument");
  }

  const serverObj = await getServerFallback(server);

  const alreadyExists = req.user.servers.some((serverId) =>
    serverId.equals(serverObj._id)
  );
  if (alreadyExists) {
    res.status(400);
    throw new Error("Server already exists in user's collection");
  }

  req.user.servers.push(serverObj._id);
  await req.user.save();

  res.status(201).json({
    message: "success",
  });
});

const getServerCollection = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(200).json([]);
  }

  const promiseList = user.servers.map(async (serverId) => {
    const server = await Server.findById(serverId);
    if (!server) {
      res.status(400);
      throw new Error("Server not Found");
    }
    return server.address;
  });

  const serverAddressList = await Promise.all(promiseList);
  res.status(200).json(serverAddressList);
});

module.exports = {
  authUser,
  addServerCollection,
  getServerCollection,
};
