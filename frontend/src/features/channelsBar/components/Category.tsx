import { useState } from "react";
import Channel from "./Channel";
import { Category as CategoryType } from "../../../libs";
import showAddChannelPop from "./AddChannelPopup";
import { useAppSelector } from "../../../hooks";
const Category = ({ category }: { category: CategoryType }) => {
  const isOwner = useAppSelector((state) => state.server.isOwner);

  const [isExpanded, setIsExpanded] = useState(true);

  const createChannel = () => {
    showAddChannelPop(category.categoryId);
  };
  return (
    <div>
      <button
        className="fill-[#949ba4] hover:fill-[#dbdee1] text-[#949ba4] hover:text-[#dbdee1] w-full flex items-center justify-between p-2"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <h3 className="flex items-center gap-2">
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8251"
            width="8"
            height="8"
            transform={isExpanded ? "rotate(90)" : ""}
          >
            <path
              d="M295.7 897.96c-18.8-18.8-18.8-49.1 0-67.9l318-318-318-318c-18.8-18.8-18.8-49.2 0-67.9 18.8-18.8 49.1-18.8 67.9 0l352 352c18.8 18.8 18.8 49.2 0 67.9l-352 352c-9.4 9.4-21.7 14-34 14C317.4 911.96 305.1 907.36 295.7 897.96z"
              p-id="8252"
            ></path>
          </svg>
          <span className="text-xs font-semibold">{category.categoryName}</span>
        </h3>

        {isOwner && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              createChannel();
            }}
          >
            <svg
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="12667"
              width="12"
              height="12"
            >
              <path
                d="M902.453225 458.944644 566.002426 458.944644 566.002426 122.503055c0-32.323173-21.61939-58.513672-48.266283-58.513672l-10.742668 0c-26.666336 0-48.266283 26.189476-48.266283 58.513672l0 336.441589L122.267183 458.944644c-32.313963 0-58.513672 21.618367-58.513672 48.275493l0 10.733459c0 26.657126 26.199709 48.275493 58.513672 48.275493l336.441589 0 0 336.441589c0 32.323173 21.618367 58.513672 48.284703 58.513672l10.723226 0c26.666336 0 48.285726-26.190499 48.285726-58.513672L566.002426 566.228065l336.450798 0c32.30373 0 58.513672-21.618367 58.513672-48.275493l0-10.733459C960.966896 480.56301 934.757978 458.944644 902.453225 458.944644z"
                p-id="12668"
              ></path>
            </svg>
          </div>
        )}
      </button>
      {isExpanded && (
        <ul>
          {category.channelList.map((channel) => (
            <li key={channel.channelId} className="px-3">
              <Channel channel={channel} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Category;
