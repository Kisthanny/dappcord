const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Server = require("../models/serverModel");
const generateToken = require("../config/generateToken");

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

  let user = await User.findOne({ address });
  if (!user) {
    user = await User.create({
      address,
    });
    if (!user) {
      res.status(400);
      throw new Error("Failed to Add the User");
    }
  }

  res.status(201).json({
    _id: user._id,
    address: user.address,
    token: generateToken(user._id),
  });
});

const addServerCollection = asyncHandler(async (req, res) => {
  const { user, server } = req.body;

  if (!user || !server) {
    res.status(400);
    throw new Error("missing argument");
  }

  let userObj = await User.findOne({ address: user });
  if (!userObj) {
    userObj = await User.create({ address: user });
    if (!userObj) {
      res.status(400);
      throw new Error("Add User Failed");
    }
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
    res.status(200).json([]);
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

module.exports = {
  authUser,
  addServerCollection,
  getServerCollection,
};
