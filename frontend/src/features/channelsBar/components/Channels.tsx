import { Dispatch, SetStateAction } from "react";
import Category from "./Category";
import { useAppSelector } from "../../../hooks";
const Channels = ({
  setAddCategoryId,
}: {
  setAddCategoryId: Dispatch<SetStateAction<string | number | bigint>>;
}) => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  return (
    <div className="relative h-full pt-[50px] pb-[53px]">
      <ul className="h-full">
        {currentServer?.categoryList.map((category) => (
          <li key={category.categoryId}>
            <Category category={category} setAddCategoryId={setAddCategoryId} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Channels;
