const { ethers } = require("ethers");
const DAPPCORD_ABI = require("../abis/DappcordServer.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

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

module.exports = {
  blockChainVerifyIsOwner,
  blockChainGetFee,
  getOwner,
  getSymbol,
  getName,
  getAccess,
  hasJoined,
  channelOnServer,
};
