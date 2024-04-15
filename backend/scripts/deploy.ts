import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";


async function main() {
    const [deployer, sheldon, leonerd, raj, howard, penny] = await hre.ethers.getSigners();
    const DappcordServer = await hre.ethers.getContractFactory("DappcordServer");
    const dappcordServer = await DappcordServer.connect(deployer).deploy("DappcordServer", "DP");

}

main().then(() => { process.exit(0) }).catch(error => {
    console.error(error);
    process.exit(1)
});
