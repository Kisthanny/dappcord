import { showPopup, closePopup, CloseIcon } from "../../../components/Popup";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { getServerContract, getSigner } from "../../../libs";
import { updateServer } from "../../../store/serverSlice";
import MyInput from "../../../components/MyInput";
const AddCategory = () => {
  const dispatch = useAppDispatch();
  const [categoryName, setCategoryName] = useState("");
  const currentServer = useAppSelector((state) => state.server.currentServer);
  const createCategory = async () => {
    if (currentServer) {
      const contract = await getServerContract(currentServer.address);
      const signer = await getSigner();
      const transaction = await contract
        .connect(signer)
        .createCategory(categoryName);
      await transaction.wait();
      await dispatch(updateServer(currentServer.address));
      closePopup();
    }
  };

  return (
    <div className="relative bg-[#313338] w-[472px] rounded-md">
      <CloseIcon />

      <div className="flex flex-col items-center text-center pt-[24px] px-[14px] pb-[10px]">
        <h1 className="text-2xl font-bold mb-1">Create Category</h1>

        <MyInput
          type="text"
          placeholder="new-category"
          name="CATEGORY NAME"
          className="bg-black"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-end gap-6 pt-[12px] px-[18px] pb-[18px] bg-[#2b2d31]">
        <button className="font-semibold" onClick={closePopup}>
          Cancel
        </button>
        <button
          className="text-white bg-[#5865f2] hover:bg-[#4752c4] active:bg-[#3c45a5] px-4 rounded-sm py-2 font-semibold transition-colors ease-in-out"
          onClick={createCategory}
        >
          Create Category
        </button>
      </div>
    </div>
  );
};

const showAddCategoryPop = (): void => {
  showPopup(<AddCategory />);
};

export default showAddCategoryPop;
