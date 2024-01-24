import React from "react";
import "./style.scss";
import { ShowStates } from "../../context/ShowContext";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatContext";
import axios from "axios";
import { UserInfoState } from "../../context/UserInfoContext";

const Logout = ({ option }) => {

  const { setShowLogout,setShowDeleteChat,setShowBlock,setShowExitGroup } = ShowStates();
  const navigate = useNavigate();
  const {sender,setSender}= ChatState();
  const {userInfo} = UserInfoState();

  const exitGroup = async (chatId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/group/exit/${chatId}`,
        { email: userInfo?.email },
        config
      );
      if (typeof data === "object") setSender(data);
      else console.log(data);
    } catch (error) {
      console.log(error.message);
      // const registrationFail = () =>
      //   toast.error(`${error?.response?.data}`, {
      //     position: toast.POSITION.TOP_CENTER,
      //     toastId: "registrationFail",
      //   });
      // registrationFail();
      return error;
    }
  };

  // console.log(chatName);
  const handleClose = () => {
    switch (option) {
      case "Log out":
        setShowLogout(false);
        break;
      case "Delete chat":
        setShowDeleteChat(false);
        break;
      case "Block":
        setShowBlock(false);
        break;
      case "Exit group":
        setShowExitGroup(false);
        break;

      default:
        break;
    }
  };
  
  const handleOption = () => {
    switch (option) {
      case "Log out":
        localStorage.removeItem("userInfo");
        navigate("/");
        setShowLogout(false);
        break;
      case "Delete chat":
        console.log("Chat deleted");
        break;
      case "Block":
        console.log("User Blocked");
        break;
      case "Exit group":
        exitGroup(sender._id);
        setShowExitGroup(false);
        break;

      default:
        break;
    }
  };
  return (
    <>
      <div className="logoutOverlay">
        <div className="logoutDiv">
          <h4>
            {option === "Log out"
              ? "Log out?"
              : option === "Delete chat"
              ? "Delete this chat?"
              : option=== "Exit group"?`Exit "${sender.chatName}" group?`:"Block UserName"}
          </h4>
          <p>
            {option === "Log out"
              ? "Are you sure you want to logout?"
              : option === "Delete chat"
              ? "Message will only be removed from this device and your device on newer version of WhatsApp"
              :option=== "Exit group"?"Only group admins will be notified that you left the group"
              : "Blocked contacts will no longer be able to call you and send you messages. This contact will not notified"}
          </p>
          <div  className="logoutButtons">
            <button
              onClick={handleClose}
              className="logoutBtn"
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={handleOption} className="logoutBtn">
              {option}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
