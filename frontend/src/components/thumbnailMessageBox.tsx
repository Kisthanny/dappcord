const ThumbnailMessageBox = ({ message }: { message: string }) => {
  return (
    <div className="relative bg-[#111214] text-[#d5d8dc] font-bold rounded-md py-2 px-3 shadow-2xl max-w-[200px] ml-3">
      <div className="absolute top-0 -left-3 h-full flex items-center">
        <div className="w-0 h-0 border-[6px] border-solid border-r-[#111214] border-l-transparent border-t-transparent border-b-transparent"></div>
      </div>
      <div className="">{message}</div>
    </div>
  );
};

export default ThumbnailMessageBox;
