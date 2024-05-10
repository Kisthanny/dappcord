const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Server = require("../models/serverModel");
const {
  blockChainVerifyIsOwner,
  blockChainGetFee,
  getAccess,
  channelOnServer,
} = require("../blockChainApi/index");

const addChannel = asyncHandler(async (req, res) => {
  const { server, channel } = req.body;
  const owner = req.user._id;

  if (!server || !channel) {
    res.status(400);
    throw new Error("Missing Argument");
  }

  const serverObj = await Server.findOne({ address: server });
  if (!serverObj) {
    res.status(400);
    throw new Error("Server not Exist");
  };

  const channelExistOnBlockChain = await channelOnServer({server,channel})
  if(!channelExistOnBlockChain){
    res.status(400)
    throw new Error('Channel does not exist on BlockChain')
  }

  const channelExist = await Chat.findOne({ server: serverObj._id, channel });
  if (channelExist) {
    res.status(400);
    throw new Error("Channel already Exists");
  }

  const isOwner = await blockChainVerifyIsOwner({
    server,
    user: req.user.address,
  });
  if (!isOwner) {
    res.status(400);
    throw new Error("User is not the owner");
  }

  const fee = await blockChainGetFee({ server, channel });

  const newChannel = await Chat.create({
    server: serverObj._id,
    channel,
    fee,
    owner,
  });
  if (!newChannel) {
    res.status(400);
    throw new Error("Failed to Add new Channel");
  }

  res.status(200).json({
    chatRoomId: newChannel._id,
    server: newChannel.server,
    channelId: newChannel.channel,
    owner: newChannel.owner,
    fee: newChannel.fee,
  });
});

const fetchChat = asyncHandler(async (req, res) => {
  const { server, channel } = req.query;
  if (!server || !channel) {
    res.status(400);
    throw new Error("Missing Argument");
  }
  const user = req.user;
  // check for access, owner or joined
  const haveAccess = await getAccess({
    user: user.address,
    server,
    channel,
  });

  if (!haveAccess) {
    res.status(400);
    throw new Error("User do not have access to Channel");
  }

  const serverObj = await Server.findOne({ address: server });
  if (!serverObj) {
    res.status(400);
    throw new Error("Server not exist");
  }

  const chat = await Chat.findOne({
    server: serverObj._id,
    channel,
  });
  if (!chat) {
    res.status(400);
    throw new Error("Chat room does not exist");
  }

  res.status(200).json({
    roomId: chat._id,
  });
});

module.exports = { addChannel, fetchChat };
