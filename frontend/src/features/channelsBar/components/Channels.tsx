import { ethers, BigNumberish } from "ethers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Category from "./Category";
export type CategoryIds = BigNumberish[];
export type ChannelIds = BigNumberish[];
export type Category = {
  categoryId: BigNumberish;
  categoryName: string;
};
export type FullCategory = {
  categoryId: BigNumberish;
  categoryName: string;
  channelIdList: ChannelIds;
};
const Channels = ({
  contract,
  setAddCategoryId,
}: {
  contract: ethers.Contract;
  setAddCategoryId: Dispatch<SetStateAction<string | number | bigint>>;
}) => {
  const [categoryList, setCategoryList] = useState([] as FullCategory[]);
  const fetchCategoryList = async () => {
    if (!contract) {
      return;
    }
    const categoryIds = (await contract.getCategoryIdList()) as CategoryIds;
    const result: FullCategory[] = [];
    for (let i = 0; i < categoryIds.length; i++) {
      const catId = categoryIds[i];
      const category = (await contract.categoryMapping(catId)) as Category;
      const channelIds = (await contract.getChannelIdList(catId)) as ChannelIds;
      const fullCategory: FullCategory = {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        channelIdList: channelIds,
      };
      result.push(fullCategory);
    }
    setCategoryList(result);
  };
  useEffect(() => {
    fetchCategoryList();
  }, [contract]);
  return (
    <div className="relative h-full pt-[50px] pb-[53px]">
      <ul className="h-full">
        {categoryList.map((fullCategory) => (
          <li key={fullCategory.categoryId}>
            <Category contract={contract} category={fullCategory} setAddCategoryId={setAddCategoryId} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Channels;
