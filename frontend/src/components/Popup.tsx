import { ReactNode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "../store/index";
const Popup = ({ children }: { children: ReactNode }) => {
  const OUTER_ID = "outer-popup";
  const outerPopupRef = useRef<HTMLDivElement>(null);
  const [shouldClose, setShouldClose] = useState(false);
  const onOuterMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((e.target as HTMLDivElement).id === OUTER_ID) {
      setShouldClose(true);
    } else {
      setShouldClose(false);
    }
  };

  const onOuterMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as HTMLDivElement).id === OUTER_ID) {
      if (shouldClose) {
        closePopup();
      }
    } else {
      setShouldClose(false);
    }
  };
  return (
    <div
      ref={outerPopupRef}
      id={OUTER_ID}
      className="fixed top-0 left-0 bottom-0 right-0 w-screen h-screen z-[1000] flex items-center justify-center bg-black bg-opacity-70"
      onMouseUp={onOuterMouseUp}
      onMouseDown={onOuterMouseDown}
    >
      <div>{children}</div>
    </div>
  );
};

let popupRoot: HTMLDivElement | null;

export const closePopup = () => {
  if (popupRoot) {
    popupRoot.remove();
  }
};

export const showPopup = (children: ReactNode) => {
  popupRoot = document.createElement("div");
  const main = document.querySelector("#main");
  if (main) {
    main.appendChild(popupRoot);
    const root = createRoot(popupRoot);
    root.render(
      <Provider store={store}>
        <Popup children={children} />
      </Provider>
    );
  }
};

export const CloseIcon = () => (
  <button
    onClick={() => {
      closePopup();
    }}
    className="absolute right-5 top-5 fill-[#73767d] hover:fill-[#DBDEE1]"
  >
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="8427"
      width="18"
      height="18"
    >
      <path
        d="M877.216 491.808M575.328 510.496 946.784 140.672c17.568-17.504 17.664-45.824 0.192-63.424-17.504-17.632-45.792-17.664-63.36-0.192L512.032 446.944 143.712 77.216C126.304 59.712 97.92 59.648 80.384 77.12 62.848 94.624 62.816 123.008 80.288 140.576l368.224 369.632L77.216 879.808c-17.568 17.504-17.664 45.824-0.192 63.424 8.736 8.8 20.256 13.216 31.776 13.216 11.424 0 22.848-4.352 31.584-13.056l371.36-369.696 371.68 373.088C892.192 955.616 903.68 960 915.168 960c11.456 0 22.912-4.384 31.648-13.088 17.504-17.504 17.568-45.824 0.096-63.392L575.328 510.496 575.328 510.496zM575.328 510.496"
        fill="inherit"
        p-id="8428"
      ></path>
    </svg>
  </button>
);
