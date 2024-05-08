const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Server = require("../models/serverModel");

const addUser = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    res.status(400);
    throw new Error("missing argument");
  }

  const userExist = await User.findOne({ address });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    address,
  });
  if (!user) {
    res.status(400);
    throw new Error("Failed to Add the User");
  }

  res.status(201).json({
    _id: user._id,
    address: user.address,
  });
});

const addServerCollection = asyncHandler(async (req, res) => {
  const { user, server } = req.body;

  if (!user || !server) {
    res.status(400);
    throw new Error("missing argument");
  }

  const userObj = await User.findOne({ address: user });
  if (!userObj) {
    res.status(400);
    throw new Error("User not found");
  }

  const serverObj = await Server.findOne({ address: server });
  if (!serverObj) {
    res.status(400);
    throw new Error("Server not found");
  }

  const alreadyExists = userObj.servers.some((serverId) =>
    serverId.equals(serverObj._id)
  );
  if (alreadyExists) {
    res.status(400);
    throw new Error("Server already exists in user's collection");
  }

  userObj.servers.push(serverObj._id);
  await userObj.save();

  res.status(201).json({
    message: "success",
  });
});

const getServerCollection = asyncHandler(async (req, res) => {
  const { address } = req.params;
  const user = await User.findOne({ address });
  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  const promiseList = user.servers.map(async (serverId) => {
    const server = await Server.findOne({ _id: serverId });
    if (!server) {
      res.status(400);
      throw new Error("Server not Found");
    }
    return server.address;
  });

  const serverAddressList = await Promise.all(promiseList);
  res.status(200).json(serverAddressList);
});

module.exports = { addUser, addServerCollection, getServerCollection };
