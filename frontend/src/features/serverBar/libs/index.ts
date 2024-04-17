import { ethers } from "ethers";
import DappcordServerAbi from "../../../abis/DappcordServer.json";

export const RPC_URL = 'http://127.0.0.1:8545/'

export const CHAIN_ID = '31337'

export async function getServerContract(address: string) {
    try {
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
        return {
            code: 1,
            data: serverContract
        }
    } catch (error) {
        return {
            code: 0,
            message: (error as Error).message
        }
    }
}