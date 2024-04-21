import Category from "./Category";
import { useAppSelector } from "../../../hooks";
const Channels = () => {
  const currentServer = useAppSelector((state) => state.server.currentServer);
  return (
    <div className="relative h-full pt-[50px] pb-[53px]">
      <ul className="h-full">
        {currentServer?.categoryList.map((category) => (
          <li key={category.categoryId}>
            <Category category={category} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Channels;
