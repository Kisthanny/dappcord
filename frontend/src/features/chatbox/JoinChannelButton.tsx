import { ethers } from "ethers";
import {
  Channel,
  Server,
  getServerContract,
  getSigner,
} from "../../libs/index";
import { useAppDispatch } from "../../hooks";
import { updateServer } from "../../store/serverSlice";

const JoinChannelButton = ({
  server,
  channel,
  onJoin,
}: {
  server: Server | null;
  channel: Channel | null;
  onJoin: (channelId:string) => void;
}) => {
  const dispatch = useAppDispatch();
  const joinChannel = async () => {
    if (server && channel) {
      const serverContract = await getServerContract(server.address);
      const signer = await getSigner();
      const transaction = await serverContract
        .connect(signer)
        .joinChannel(channel.channelId, {
          value: channel.channelFee,
        });
      await transaction.wait();
      await dispatch(updateServer(server.address));
      onJoin(channel.channelId);
    }
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <h1>CHANNEL FEE</h1>
      <span className="text-xl font-bold">
        {channel && ethers.formatEther(channel.channelFee.toString())} ETH
      </span>
      <button
        className="text-white bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a5] px-4 rounded-sm py-2 font-semibold transition-colors ease-in-out"
        onClick={joinChannel}
      >
        Join the Channel
      </button>
    </div>
  );
};

export default JoinChannelButton;
