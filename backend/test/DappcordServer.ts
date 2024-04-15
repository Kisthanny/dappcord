import { expect } from "chai";
import hre from "hardhat";
import { DappcordServer } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const tokens = (n: string | number) => hre.ethers.parseEther(n.toString())

const wait = (n: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null)
        }, n)
    })
}

describe("DappcordServer", function () {
    const SERVER_NAME = "KK's server";
    const SERVER_SYMBOL = "KK";
    let owner: HardhatEthersSigner;
    let sheldon: HardhatEthersSigner;
    let leonerd: HardhatEthersSigner;
    let raj: HardhatEthersSigner;
    let howard: HardhatEthersSigner;
    let penny: HardhatEthersSigner;
    let dappcordServer: DappcordServer & {
        deploymentTransaction(): ContractTransactionResponse;
    }
    beforeEach(async () => {
        [owner, sheldon, leonerd, raj, howard, penny] = await hre.ethers.getSigners();
        // Create a new Server
        const DappcordServer = await hre.ethers.getContractFactory("DappcordServer");
        dappcordServer = await DappcordServer.connect(owner).deploy(SERVER_NAME, SERVER_SYMBOL);
    })
    describe("Deployment", () => {
        it("Sets Server Info", async () => {
            const serverOwner = await dappcordServer.owner();
            expect(serverOwner).equal(owner.address)
            const name = await dappcordServer.name();
            expect(name).equal(SERVER_NAME)
            const symbol = await dappcordServer.symbol();
            expect(symbol).equal(SERVER_SYMBOL)
        })
    })
    describe("Create Category", () => {
        const CATEGORY_NAME = 'TEXT CHANNELS'
        const CATEGORY_ID = 10001;
        beforeEach(async () => {
            const transaction = await dappcordServer.connect(owner).createCategory(CATEGORY_NAME)
            await transaction.wait();
        })
        it('Updates Category ID List', async () => {
            const categoryIdList = await dappcordServer.getCategoryIdList();
            expect(categoryIdList.length).equal(1)
            expect(categoryIdList[0]).equal(CATEGORY_ID)
        })
        it('Saves Category', async () => {
            const category = await dappcordServer.categoryMapping(CATEGORY_ID);
            expect(category.categoryId).equal(CATEGORY_ID);
            expect(category.categoryName).equal(CATEGORY_NAME);
        })
        describe("Edit Category", () => {
            const NEW_CATEGORY_NAME = "====== GENERAL ======";
            beforeEach(async () => {
                const transaction = await dappcordServer.connect(owner).editCategoryName(CATEGORY_ID, NEW_CATEGORY_NAME);
                await transaction.wait();
            })
            it("Updates Category Name", async () => {
                const category = await dappcordServer.categoryMapping(CATEGORY_ID);
                expect(category.categoryName).equal(NEW_CATEGORY_NAME)
            })
        })
        describe("Create Channel", () => {
            const CHANNEL_ID = 10001;
            const CHANNEL_NAME = 'general';
            const CHANNEL_TOPIC = `KK's general text channel`;
            const CHANNEL_TYPE = 0;
            const CHANNEL_FEE = tokens(1);

            beforeEach(async () => {
                const transaction = await dappcordServer.connect(owner).createChannel(CHANNEL_NAME, CHANNEL_TOPIC, CHANNEL_TYPE, CHANNEL_FEE, CATEGORY_ID)
                await transaction.wait();
            })
            it('Updates Channel ID List', async () => {
                const channel = await dappcordServer.channelMapping(CHANNEL_ID)
                expect(channel.channelId).equal(CHANNEL_ID);
                expect(channel.channelName).equal(CHANNEL_NAME);
                expect(channel.channelTopic).equal(CHANNEL_TOPIC);
                expect(channel.channelType).equal(CHANNEL_TYPE);
                expect(channel.channelFee).equal(CHANNEL_FEE);
                expect(channel.categoryId).equal(CATEGORY_ID);
            })

            describe("Edit Channel", () => {
                const NEW_CHANNEL_NAME = "chat";
                const NEW_CHANNEL_TOPIC = "General Chat";

                beforeEach(async () => {
                    let transaction = await dappcordServer.connect(owner).editChannelName(CHANNEL_ID, NEW_CHANNEL_NAME);
                    await transaction.wait();

                    transaction = await dappcordServer.connect(owner).editChannelTopic(CHANNEL_ID, NEW_CHANNEL_TOPIC);
                    await transaction.wait();
                })
                it("Updates Channel Name", async () => {
                    const channel = await dappcordServer.channelMapping(CHANNEL_ID)
                    expect(channel.channelName).equal(NEW_CHANNEL_NAME);
                    expect(channel.channelTopic).equal(NEW_CHANNEL_TOPIC)
                })
            })

            describe("Join Channel", () => {

                beforeEach(async () => {
                    const transaction = await dappcordServer.connect(sheldon).joinChannel(CHANNEL_ID, { value: CHANNEL_FEE });
                    await transaction.wait();
                })
                it("Updates Channel Member List", async () => {
                    const hasJoined = await dappcordServer.hasJoined(CHANNEL_ID, sheldon.address);
                    expect(hasJoined).equal(true)
                })

                describe("Withdraw", () => {
                    let ownerBeforeBalance: bigint;
                    beforeEach(async () => {
                        ownerBeforeBalance = await hre.ethers.provider.getBalance(owner.address);
                        const transaction = await dappcordServer.connect(owner).withdraw();
                        await transaction.wait();
                    })
                    it("Adds Owner Balance", async () => {
                        const ownerAfterBalance = await hre.ethers.provider.getBalance(owner.address);
                        expect(ownerAfterBalance).greaterThan(ownerBeforeBalance);
                    })
                })
            })
        })
    })
});
