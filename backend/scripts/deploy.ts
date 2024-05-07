import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
const tokens = (n: string | number) => hre.ethers.parseEther(n.toString())

async function main() {
    const [sheldon, leonerd, raj, howard, penny] = await hre.ethers.getSigners();
    // deploy the server
    const DappcordServer = await hre.ethers.getContractFactory("DappcordServer");
    const sheldonServer = await DappcordServer.connect(sheldon).deploy("Sheldonopoly", "S");
    const leonerdServer = await DappcordServer.connect(leonerd).deploy("Hofstaton", "H");
    const rajServer = await DappcordServer.connect(raj).deploy("Rajmahal", "R");
    const howardServer = await DappcordServer.connect(howard).deploy("Wolowizburg", "W");

    console.log('sheldon', await sheldonServer.getAddress())
    console.log('leonerd', await leonerdServer.getAddress())
    console.log('raj', await rajServer.getAddress())
    console.log('howard', await howardServer.getAddress())

    // add category
    let transaction = await sheldonServer.connect(sheldon).createCategory("TEXT CHANNELS");
    await transaction.wait();
    transaction = await sheldonServer.connect(sheldon).createCategory("VOIVE CHANNELS");
    await transaction.wait();
    const [textCategoryId, voiceCategoryId] = await sheldonServer.getCategoryIdList();
    // add channel
    transaction = await sheldonServer.connect(sheldon).createChannel('general', 'For General Chat', 0, tokens(0), textCategoryId);
    await transaction.wait();
    transaction = await sheldonServer.connect(sheldon).createChannel('General', 'Voice Chat Room', 1, tokens(0), voiceCategoryId);
    await transaction.wait();
}

main().then(() => { process.exit(0) }).catch(error => {
    console.error(error);
    process.exit(1)
});
