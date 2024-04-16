import { useAppDispatch, useAppSelector } from "../hooks";
import { setCurrentAddress } from "./accountSlice";
const Connect = () => {
  const currentAddress = useAppSelector(
    (state) => state.account.currentAddress
  );
  const dispatch = useAppDispatch();
  const handleConnect = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum === undefined) {
        throw new Error("Please install Metamask");
      }
      const result: string[] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(setCurrentAddress(result[0]));
    } catch (error) {}
  };
  const addressFilter = (address: string) => {
    if (address.length <= 10) {
      return address;
    }
    return `${address.slice(2, 6)}...${address.slice(-4)}`;
  };
  return (
    <button
      onClick={handleConnect}
      className="bg-[#313338] hover:bg-[#23a559] text-[#23a559] hover:text-white transition ease-in px-4 py-2 rounded-md font-semibold"
    >
      {currentAddress === "0x" ? "connect" : addressFilter(currentAddress)}
    </button>
  );
};

export default Connect;
