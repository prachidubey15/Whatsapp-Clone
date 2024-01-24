import React, { useRef, useState } from "react";
import "./style.scss";
import { HiMiniUserGroup } from "react-icons/hi2";
import { PiCircleDashedBold } from "react-icons/pi";
import { BiSolidMessageDetail } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { ProfileDp, OptionMenu } from "../exportComponents";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";

const ChatNavbar = () => {
  const [toggleOption, setToggleOption] = useState(false);
  const optionMenuRef = useRef();
  const shadowRef = useRef();
  const { setShowNewMessage } = ShowStates();
  const options = ["New group", "Setting", "Log out"];
  const handleShowOption = () => {
    setToggleOption((prev) => !prev);
    if (!toggleOption) {
      shadowRef.current.style.backgroundColor = "#dadada";
      optionMenuRef.current.style.display = "initial";
    } else {
      shadowRef.current.style.backgroundColor = "transparent";
      optionMenuRef.current.style.display = "none";
    }
  };

  return (
    <>
      <div className="chatNavbarWrapper">
        <ProfileDp />
        <div className="chatNavbarIcon">
          {/* <HiMiniUserGroup /> */}
          <PiCircleDashedBold />
          <BiSolidMessageDetail onClick={() => setShowNewMessage(true)} />
          <div className="optionContainer">
            <div ref={shadowRef} className="moreBg">
              <SlOptionsVertical onClick={handleShowOption} />
            </div>
            <OptionMenu
              setToggleOption={setToggleOption}
              ref={optionMenuRef}
              options={options}
              handleShowOption={handleShowOption}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatNavbar;
