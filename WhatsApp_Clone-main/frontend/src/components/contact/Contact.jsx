import React, { useEffect, useState } from "react";
import "./style.scss";
import { OptionMenu, UserDp } from "../exportComponents";
import { findAdmin } from "../../utils/group";
import { FiChevronDown } from "react-icons/fi";
import { ShowStates } from "../../context/ShowContext";
import { ChatState } from "../../context/ChatContext";
import { UserInfoState } from "../../context/UserInfoContext";
import axios from "axios";

const Contact = ({ isParticipant, user, onClick, padding }) => {
  // const { setShowGroupOption } = ShowStates();
  const { userInfo } = UserInfoState();
  const {sender,setSender }= ChatState();
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [userId,setUserId] = useState();

  let options = ["Remove"];

  const isAdmin = findAdmin(userInfo._id, isParticipant);
  const toggleOption = ()=>{
    const isAdmin = findAdmin(user._id,isParticipant);
    isAdmin === -1
      ? options.unshift("Make  group admin")
      : options.unshift("Dismiss admin");
  }
  const handleShowGroupMenu = (e) => {
    e.stopPropagation();
    setShowGroupOption(!showGroupOption);
    setUserId(user._id);
    // console.log(e.offsetX,e.offsetY);
  };
  

  toggleOption();

  return (
    <>
      <div
        onClick={() => onClick(user)}
        style={isParticipant ? padding : null}
        className="contact"
      >
        <div className="dp">
          <UserDp dpImg={user?.profilePic} />
        </div>
        <div className="details">
          <div className="info">
            <h3 className="userName">{user?.userName}</h3>
            <h5 className="about">{user?.about}</h5>
          </div>
          <div className="grpOption">
            {isParticipant ? (
              findAdmin(user._id, isParticipant) === -1 ? null : (
                <div
                  style={{ display: showGroupOption ? "none" : null }}
                  className="groupAdmin"
                >
                  <h6>Group Admin</h6>
                </div>
              )
            ) : null}
            <div onClick={handleShowGroupMenu} className="optionMenu">
              {isAdmin !== -1 && showGroupOption ? (
                <OptionMenu
                  css={{ position: "unset", display: "block" }}
                  options={options}
                  setToggleOption={setShowGroupOption}
                  handleShowOption={user._id}
                  chatId={sender._id}
                />
              ) : null}
              <FiChevronDown
                display={"block"}
                fontSize={"1.3rem"}
                className="optionIcon"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
