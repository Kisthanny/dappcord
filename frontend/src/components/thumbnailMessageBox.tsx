const ThumbnailMessageBox = ({
  isShow,
  message,
}: {
  isShow: boolean;
  message: string;
}) => {
  return (
    <div
      className={`relative w-[200px] ml-3 transition-opacity cursor-default pointer-events-none z-20 ${
        isShow ? "opacity-100" : "opacity-0 hidden"
      }`}
    >
      <div className="absolute top-0 -left-3 h-full flex items-center">
        <div className="w-0 h-0 border-[6px] border-solid border-r-[#111214] border-l-transparent border-t-transparent border-b-transparent"></div>
      </div>
      <div className="inline-block max-w-[200px] whitespace-normal break-words bg-[#111214] text-[#d5d8dc] font-bold rounded-md py-2 px-3 shadow-2xl shadow-stone-900">
        {message}
      </div>
    </div>
  );
};

export default ThumbnailMessageBox;
