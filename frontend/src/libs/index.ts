import { ethers } from "ethers";
import DappcordServerAbi from "../abis/DappcordServer.json";
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
    address: string,
    name: string,
    symbol: string,
    categoryList: Category[],
}

export const RPC_URL = 'http://127.0.0.1:8545/'

export const CHAIN_ID = '31337'

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