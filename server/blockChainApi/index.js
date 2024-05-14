const { ethers } = require("ethers");
const DAPPCORD_ABI = require("../abis/DappcordServer.json");
require("dotenv").config();

const getProvider = () => {
  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    throw new Error("RPC_URL is not defined in .env file");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  provider
    .getNetwork()
    .then((network) => {
      console.log("Connected to network:", network);
    })
    .catch((error) => {
      console.error("Failed to connect to network:", error);
    });

  return provider;
};

const provider = getProvider();

const blockChainVerifyIsOwner = async ({ server, user }) => {
  try {
    const contract = new ethers.Contract(server, DAPPCORD_ABI, provider);
    const owner = await contract.owner();

    return owner.toLocaleLowerCase().trim() === user;
  } catch (error) {
    return false;
  }
};

const blockChainGetFee = async ({ server, channel }) => {
  const contract = new ethers.Contract(server, DAPPCORD_ABI, provider);
  const channelRes = await contract.channelMapping(channel);
  return channelRes.channelFee.toString();
};

const getOwner = async (address) => {
  const contract = new ethers.Contract(address, DAPPCORD_ABI, provider);
  return await contract.owner();
};

const getSymbol = async (address) => {
  const contract = new ethers.Contract(address, DAPPCORD_ABI, provider);
  return await contract.symbol();
};

const getName = async (address) => {
  const contract = new ethers.Contract(address, DAPPCORD_ABI, provider);
  return await contract.name();
};

const hasJoined = async ({ server, channel, user }) => {
  const contract = new ethers.Contract(server, DAPPCORD_ABI, provider);
  return await contract.hasJoined(channel, user);
};

const getAccess = async ({ user, server, channel }) => {
  const isOwner = (await getOwner(server)).toLocaleLowerCase() === user;
  if (isOwner) {
    return true;
  }

  const userHasJoined = await hasJoined({ server, channel, user });
  if (userHasJoined) {
    return true;
  }

  return false;
};

const channelOnServer = async ({ server, channel }) => {
  const contract = new ethers.Contract(server, DAPPCORD_ABI, provider);
  const channelObj = await contract.channelMapping(channel);
  return channelObj.channelId !== 0n;
};

const isAddress = (address) => {
  return ethers.isAddress(address);
};

module.exports = {
  blockChainVerifyIsOwner,
  blockChainGetFee,
  getOwner,
  getSymbol,
  getName,
  getAccess,
  hasJoined,
  channelOnServer,
  isAddress,
};
