const Server = require("../models/serverModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const {
  getOwner,
  getSymbol,
  getName,
  isAddress,
  blockChainGetFee,
  channelOnServer,
} = require("../blockChainApi/index");
/**
 * return a DB Server object
 * throws an Error if server does not exist on block chain
 * create a new one if object does not exist in DB
 * @param {*} address
 */
const getServerFallback = async (address) => {
  // seach for server obj
  let server = await Server.findOne({ address });
  if (server) {
    return server;
  }

  const [owner, symbol, name] = await Promise.all([
    getOwner(address),
    getSymbol(address),
    getName(address),
  ]);

  server = await Server.create({
    owner,
    address,
    name,
    symbol,
  });
  if (!server) {
    throw new Error("Failed to Add the Server");
  }
  return server;
};

/**
 * return a DB User object
 * throws an Error if address is not a blockchain address
 * create a new one if object does not exist in DB
 * @param {*} address
 */
const getUserFallback = async (_address) => {
  const address = _address.toLowerCase();
  let user = await User.findOne({ address });
  if (user) {
    return user;
  }

  if (!isAddress(address)) {
    throw new Error("User address Invalid");
  }
  user = await User.create({
    address,
  });
  if (!user) {
    throw new Error("Failed to Add the User");
  }

  return user;
};

/**
 * return a DB Chat object
 * throws an Error if channel does not exist on blockchain
 * create a new one if object does not exist in DB
 * @param {*} address
 */
const getChatFallback = async ({ server, channel }) => {
  const serverObj = await getServerFallback(server);
  let chat = await Chat.findOne({ server: serverObj._id, channel });
  if (chat) {
    return chat;
  }

  const [fee, exist] = await Promise.all([
    blockChainGetFee({ server, channel }),
    channelOnServer({ server, channel }),
  ]);

  if (!exist) {
    throw new Error("Channel does not Exist on blockchain");
  }

  const owner = getUserFallback(serverObj.owner);

  chat = await Chat.create({
    server: serverObj._id,
    owner: owner._id,
    channel,
    fee,
  });

  if (!chat) {
    throw new Error("Failed to Add the Chat");
  }

  return chat;
};

module.exports = { getServerFallback, getUserFallback, getChatFallback };
