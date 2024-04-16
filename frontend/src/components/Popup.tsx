import { ReactNode } from "react";
const Popup = ({
  children,
  show,
  setShow,
}: {
  children: ReactNode;
  show: boolean;
  setShow: (arg: boolean) => void;
}) => {
  const closePopup = () => {
    setShow(false);
  };
  if (show) {
    return (
      <div
        className="fixed w-screen h-screen z-[1000] flex items-center justify-center bg-black bg-opacity-70"
        onClick={closePopup}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    );
  }
};

export default Popup;
