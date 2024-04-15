import { useState } from "react";
import addGreen from "@/assets/add-23A559.svg";
import addWhite from "@/assets/add-FFFFFF.svg";
import ThumbnailMessageBox from "../../../components/thumbnailMessageBox";
const AddIcon = () => {
  const [isHovered, setIsHovered] = useState(false);
  let easeInTimer: NodeJS.Timeout;
  const handleMouseEnter = () => {
    easeInTimer = setTimeout(() => {
      setIsHovered(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (easeInTimer) {
      clearTimeout(easeInTimer);
    }
    setIsHovered(false);
  };
  return (
    <div className="relative flex items-center justify-center py-1">
      <button
        className="transition ease-in rounded-full hover:rounded-2xl bg-[#313338] hover:bg-[#23a559] p-4"
        title="add server"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          width={18}
          height={18}
          src={isHovered ? addWhite : addGreen}
          className="hover:fill-[#ffffff]"
          alt="add server"
        />
      </button>
      <div className="absolute left-full">
        <ThumbnailMessageBox message="Add a Server" />
      </div>
    </div>
  );
};

export default AddIcon;
