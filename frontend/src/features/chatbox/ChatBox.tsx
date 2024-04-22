import { useAppSelector, useAppDispatch } from "../../hooks";
import { getServerContract, getSigner } from "../../libs";
import { setUserHasJoined } from "../../store/channelSlice";

const ChatBox = () => {
  const dispatch = useAppDispatch();
  const userHasJoined = useAppSelector((state) => state.channel.userHasJoined);
  const isOwner = useAppSelector((state) => state.server.isOwner);
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const currentChannel = useAppSelector(
    (state) => state.channel.currentChannel
  );
  const joinChannel = async () => {
    if (currentServer && currentChannel) {
      const serverContract = await getServerContract(currentServer.address);
      const signer = await getSigner();
      const transaction = await serverContract
        .connect(signer)
        .joinChannel(currentChannel.channelId, {
          value: currentChannel.channelFee,
        });
      await transaction.wait();
      dispatch(
        setUserHasJoined({
          serverAddress: currentServer.address,
          channelId: currentChannel.channelId,
          userAddress: signer.address,
        })
      );
    }
  };

  if (isOwner || userHasJoined) {
    return <div>Chat Box</div>;
  } else {
    return <button onClick={joinChannel}>Join the Channel</button>;
  }
};

export default ChatBox;
