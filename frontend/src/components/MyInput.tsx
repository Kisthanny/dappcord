import { useRef, useEffect, forwardRef, InputHTMLAttributes } from "react";
interface MyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: JSX.Element;
}

const MyInput = forwardRef<HTMLInputElement, MyInputProps>((props, ref) => {
  const { name, icon, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <h4 className="text-left w-full text-xs font-bold text-[#dbdee1] my-2">
        {name}
      </h4>
      <div className="fill-[#dbdee1] flex items-center gap-1 w-full bg-[#1e1f22] p-2 rounded-md">
        {icon && icon}
        <input
          {...rest}
          ref={ref || inputRef}
          className="w-full bg-transparent text-[#dbdee1] outline-none"
        />
      </div>
    </>
  );
});
export default MyInput;
