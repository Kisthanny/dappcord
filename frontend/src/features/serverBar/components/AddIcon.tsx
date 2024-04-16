import addGreen from "@/assets/add-23A559.svg";
import addWhite from "@/assets/add-FFFFFF.svg";
import Icon, { IconType } from "./Icon";
const AddIcon = () => {
  const addServer = () => {
    console.log("add a server");
  };
  return (
    <Icon
      onClick={addServer}
      type={IconType.IMG}
      title="Add a Server"
      idleImg={addGreen}
      activeImg={addWhite}
      activeBackground="#23a559"
    />
  );
};

export default AddIcon;
