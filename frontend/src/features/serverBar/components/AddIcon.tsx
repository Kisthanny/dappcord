import addGreen from "@/assets/add-23A559.svg";
import addWhite from "@/assets/add-FFFFFF.svg";
import Icon, { IconType } from "./Icon";
import AddServerPopup from "./AddServerPopup";
import { useState } from "react";
const AddIcon = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Icon
        onClick={() => {
          setShow(true);
        }}
        type={IconType.IMG}
        title="Add a Server"
        idleImg={addGreen}
        activeImg={addWhite}
        activeBackground="#23a559"
      />
      <AddServerPopup show={show} setShow={setShow} />
    </>
  );
};

export default AddIcon;
