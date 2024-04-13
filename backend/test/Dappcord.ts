import { expect } from "chai";
import hre from "hardhat";
import { Dappcord } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const tokens = (n: string | number) => hre.ethers.parseUnits(n.toString(), "ether");

const wait = (n: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null)
        }, n)
    })
}

describe("Dappcord", function () {
    const NAME = "Dappcord";
    const SYMBOL = "DC";
    const CHANNEL_ID = 1;
    const CHANNEL_NAME = "general"
    const AMOUNT = tokens(1);
    let deployer: HardhatEthersSigner;
    let ash: HardhatEthersSigner;
    let sheldon: HardhatEthersSigner;
    let leonerd: HardhatEthersSigner;
    let raj: HardhatEthersSigner;
    let howard: HardhatEthersSigner;
    let penny: HardhatEthersSigner;
    let dappcord: Dappcord & {
        deploymentTransaction(): ContractTransactionResponse;
    }

    beforeEach(async () => {
        [deployer, ash, sheldon, leonerd, raj, howard, penny] = await hre.ethers.getSigners();
        const Dappcord = await hre.ethers.getContractFactory("Dappcord");
        dappcord = await Dappcord.connect(deployer).deploy(NAME, SYMBOL);

        const transaction = await dappcord.connect(deployer).createChannel(CHANNEL_NAME, AMOUNT)
        await transaction.wait();
    })

    describe("Deployment", () => {
        it("Sets the name", async () => {
            const name = await dappcord.name()
            expect(name).equal(NAME);
        })
        it("Sets the symbol", async () => {
            const symbol = await dappcord.symbol();
            expect(symbol).equal(SYMBOL)
        })
        it("Sets the owner", async () => {
            const owner = await dappcord.owner()
            expect(owner).equal(deployer.address)
        })
    })

    describe("Creating Channels", () => {
        it("Saves the channel", async () => {
            const channel_1 = await dappcord.channels(CHANNEL_ID);
            const { id, name, cost } = channel_1;
            expect(id).equal(1);
            expect(name).equal(CHANNEL_NAME);
            expect(cost).equal(AMOUNT)
        })
    })

    describe('Joining Channels', () => {

        beforeEach(async () => {
            try {
                const transaction = await dappcord.connect(ash).mint(CHANNEL_ID, { value: tokens(0.5) })
                await transaction.wait();
                expect.fail('should fail with insufficient amount');
            } catch (error) {
                expect((error as Error).message).include("insufficient mint fee")
            }
            const transaction = await dappcord.connect(ash).mint(CHANNEL_ID, { value: AMOUNT })
            await transaction.wait();
        })

        it('Joins Ash', async () => {
            const ashHasJoined = await dappcord.hasJoined(CHANNEL_ID, ash.address)
            expect(ashHasJoined).equal(true);
        })

        it('Increases NFT counter', async () => {
            const nftCount = await dappcord.nftCounter();
            expect(nftCount).equal(1)
        })

        it('Updates the contract balance', async () => {
            const balance = await hre.ethers.provider.getBalance(await dappcord.getAddress());
            expect(balance).equal(AMOUNT)
        })
    })

    describe('Withdrawing', () => {
        const name = 'BIG BANG'
        const cost = tokens(5)
        function getChannelId(): Promise<bigint> {
            return new Promise((resolve, reject) => {
                const event = dappcord.filters.ChannelCreated();
                type Args = [bigint, string, bigint, string];
                const listener = ({ args }: { args: Args }) => {
                    const [_channelId, _name, _cost, _ownerAddress] = args
                    console.log('3 监听到ChannelCreated');
                    if (_name === name && _ownerAddress === sheldon.address) {

                        console.log('4 获取到_channelId: ', _channelId)
                        resolve(_channelId as bigint)
                        dappcord.removeListener(event, listener);
                    }
                }
                console.log('1 开始监听')
                dappcord.on(event, listener)
            })
        }
        let channelId: bigint;
        let sheldonBeforeBalance: bigint;
        beforeEach(async () => {
            getChannelId().then(res => {
                console.log('5 赋值到外部channelId: ', res.toString())
                channelId = res
            });
            console.log('2 before createChannel')
            let transaction = await dappcord.connect(sheldon).createChannel(name, cost)
            await transaction.wait();

            console.log('6 after createChannel')

            while (!channelId) {

                console.log('7 等待200')
                await wait(200);
            }

            const joinBigBang = async (signer: HardhatEthersSigner) => {
                const _transaction = await dappcord.connect(signer).mint(channelId, { value: cost });
                await _transaction.wait();
            }

            await joinBigBang(leonerd);
            await joinBigBang(raj);
            await joinBigBang(howard);
            await joinBigBang(penny);

            sheldonBeforeBalance = await hre.ethers.provider.getBalance(sheldon.address);

            transaction = await dappcord.connect(sheldon).withdraw(channelId);
            await transaction.wait();
        })
        it('Updates sheldon balance', async () => {
            const sheldonAfterBalance = await hre.ethers.provider.getBalance(sheldon.address);
            console.log(hre.ethers.formatEther(sheldonAfterBalance))
            expect(sheldonAfterBalance).greaterThan(sheldonBeforeBalance)
        })
    })
});
