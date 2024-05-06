import { ethers } from "ethers";
import DappcordServerAbi from "../abis/DappcordServer.json";
import ContractConfig from "../../contract.config.json"
import { DappcordServer } from "../../types/ethers-contracts";

export type Channel = {
    channelId: string;
    channelName: string;
    channelTopic: string;
    channelType: number;
    channelFee: string;
    categoryId: string;
    memberList: string[];
}

export type Category = {
    categoryId: string,
    categoryName: string,
    channelList: Channel[]
}

export type Server = {
    owner: string,
    address: string,
    name: string,
    symbol: string,
    categoryList: Category[],
}

export const RPC_URL = import.meta.env.VITE_RPC_URL;

export const CHAIN_ID = import.meta.env.CHAIN_ID;

export async function deployDappcordServer(name: string, symbol: string) {
    const ethereum = window.ethereum;
    if (ethereum === undefined) {
        throw new Error('Please install Metamask')
    }

    const signer = await getSigner();
    const contractFactory = new ethers.ContractFactory(DappcordServerAbi, ContractConfig[31337].DappcordServer.bytecode, signer)
    const contract = await contractFactory.deploy(name, symbol)
    const address = await contract.getAddress()
    return address;
}

export async function getServerContract(address: string) {
    const ethereum = window.ethereum;
    if (ethereum === undefined) {
        throw new Error('Please install Metamask')
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL)

    // Check if the contract exists
    const code = await provider.getCode(address);
    if (code === '0x') {
        // Contract doesn't exist
        throw new Error('Contract does not exist at the specified address');
    }

    const serverContract = new ethers.Contract(address, DappcordServerAbi, provider)
    return serverContract as unknown as DappcordServer;
}
export const getSigner = async () => {
    if (window.ethereum === undefined) {
        throw new Error('Please install Metamask')
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner();
}

export const getServerInfo = async (contract: DappcordServer) => {
    const server: Server = {
        owner: await contract.owner(),
        address: await contract.getAddress(),
        name: await contract.name(),
        symbol: await contract.symbol(),
        categoryList: await getCategoryList(contract),
    }
    return server;
}

export const getCategoryList = async (contract: DappcordServer) => {
    const categoryIdList = await contract.getCategoryIdList();
    const promiseList = categoryIdList.map(async (categoryId) => {
        const category = await contract.categoryMapping(categoryId)
        return {
            categoryId: category.categoryId.toString(),
            categoryName: category.categoryName,
            channelList: await getChannelList(contract, categoryId.toString())
        }
    })
    return await Promise.all(promiseList)
}

export const getChannelList = async (contract: DappcordServer, categoryId: string) => {
    const channelIdList = await contract.getChannelIdList(categoryId);
    const promiseList = channelIdList.map(async (channelId) => {
        const channel = await contract.channelMapping(channelId)
        return {
            channelId: channel.channelId.toString(),
            channelName: channel.channelName,
            channelTopic: channel.channelTopic,
            channelType: Number(channel.channelType),
            channelFee: channel.channelFee.toString(),
            categoryId: channel.categoryId.toString(),
            memberList: await contract.getMemberList(channelId)
        }
    })
    return await Promise.all(promiseList)
}

export const getUserHasJoinedSync = (channel: Channel, userAddress: string) => {
    return channel.memberList.some(address => address.toLocaleLowerCase() === userAddress.toLocaleLowerCase())
}

export const getIsOwnerSync = (server: Server, userAddress: string) => {
    return server.owner.toLocaleLowerCase() === userAddress.toLocaleLowerCase()
}

export const getChannelById = (channelId: string, server: Server) => {
    const categoryList = server.categoryList;
    for (let i = 0; i < categoryList.length; i++) {
        const cate = categoryList[i];
        const channelList = cate.channelList;
        for (let j = 0; j < channelList.length; j++) {
            const channel = channelList[j];
            if (channel.channelId.toLocaleLowerCase() === channelId.toLocaleLowerCase()) {
                return channel
            }
        }
    }
    throw new Error('not found channel by channelId')
}