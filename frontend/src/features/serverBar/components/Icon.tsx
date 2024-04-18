import { useState, CSSProperties, MouseEventHandler } from "react";
import ThumbnailMessageBox from "../../../components/ThumbnailMessageBox";
export enum IconType {
  TEXT = "TEXT",
  IMG = "IMG",
}
const Icon = ({
  type,
  idleImg,
  activeImg,
  text,
  title = "",
  idleBackground = "#313338",
  activeBackground = "#5865f2",
  onClick,
  fixedSelected = false,
}: {
  type: IconType;
  idleImg?: string;
  activeImg?: string;
  text?: string;
  title?: string;
  idleBackground?: string;
  activeBackground?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  fixedSelected?: boolean;
}) => {
  const idleBg = {
    background: idleBackground,
  } as CSSProperties;
  const activeBg = {
    background: activeBackground,
  } as CSSProperties;

  if (
    type === IconType.IMG &&
    (idleImg === undefined || activeImg === undefined)
  ) {
    throw TypeError(
      "Icon component: idleImg and activeImg must be given when type is set to IconType.IMG"
    );
  }
  if (type === IconType.TEXT && text === undefined) {
    throw TypeError(
      "Icon component: text must be given when type is set to IconType.TEXT"
    );
  }
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
        className={`w-[50px] h-[50px] flex items-center justify-center transition ease-in ${
          fixedSelected ? "rounded-2xl" : "rounded-full hover:rounded-2xl"
        } p-4`}
        style={isHovered ? activeBg : idleBg}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {type === IconType.IMG ? (
          <img
            width={18}
            height={18}
            src={isHovered ? activeImg : idleImg}
            alt=""
          />
        ) : (
          <span>{text}</span>
        )}
      </button>
      <div className="absolute left-full">
        <ThumbnailMessageBox isShow={isHovered} message={title} />
      </div>
    </div>
  );
};

export default Icon;
