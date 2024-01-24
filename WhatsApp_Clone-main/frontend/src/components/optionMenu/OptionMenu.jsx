import React, { forwardRef, useEffect } from "react";
import "./style.scss";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";
import {Link,Navigate} from "react-router-dom"
import axios from "axios";
import { ChatState } from "../../context/ChatContext";
const OptionMenu = forwardRef(
  ({ options, setToggleOption, handleShowOption,css,chatId }, ref) => {
    const {
      setShowNewGroup,
      setShowSetting,
      setShowLogout,
      setShowBlock,
      setShowDeleteChat,
      setShowOpenChat,
      setShowContactInfo,
      setShowExitGroup
    } = ShowStates();
    const {userInfo} = UserInfoState();
    const {setSender} = ChatState();

    const makeAdmin = async (chatId,userId) => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.jwttoken}`,
          "Content-type": "application/json",
        },
      };
      try {
        const { data } = await axios.put(
          `http://localhost:5000/api/chat/group/make-admin/${chatId}`,
          { email: userInfo?.email, newAdminId: userId },
          config
        );
        console.log(data);
        if (typeof data === "object") setSender(data);
        // setSender(data);
      } catch (error) {
        // console.log(error.message);
        // const registrationFail = () =>
        //   toast.error(`${error?.response?.data}`, {
        //     position: toast.POSITION.TOP_CENTER,
        //     toastId: "registrationFail",
        //   });
        // registrationFail();
        return error;
      }
    };

    const dismissAdmin = async (chatId, userId) => {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.jwttoken}`,
          "Content-type": "application/json",
        },
      };
      try {
        const { data } = await axios.put(
          `http://localhost:5000/api/chat/group/dismiss-admin/${chatId}`,
          { email: userInfo?.email, adminId: userId },
          config
        );
        if(typeof (data) === 'object')setSender(data);
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
    const removeUser = async (chatId,userId)=>{
     const config = {
       headers: {
         Authorization: `Bearer ${userInfo?.jwttoken}`,
         "Content-type": "application/json",
       },
     };
     try {
       const { data } = await axios.put(
         `http://localhost:5000/api/chat/group/remove-user/${chatId}`,
         { email: userInfo?.email, userId: userId },
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
    }

    const handleClick = (option) => {
      switch (option) {
        case "New group":
          setToggleOption(true);
          handleShowOption();
          setShowNewGroup(true);
          break;
        case "Setting":
          setToggleOption(true);
          handleShowOption();
          setShowSetting(true);
          break;
        case "Log out":
          setToggleOption(true);
          handleShowOption();
          setShowLogout(true);
          break;
        case "Contact info":
          setToggleOption(true);
          handleShowOption();
          setShowContactInfo(true);
          break;
        case "Group info":
          setToggleOption(true);
          handleShowOption();
          setShowContactInfo(true);
          break;
        case "Close chat":
          setToggleOption(true);
          handleShowOption();
          setShowOpenChat(false);
          break;
        case "Delete chat":
          setToggleOption(true);
          handleShowOption();
          setShowDeleteChat(true);
          break;
        case "Clear messages":
          setToggleOption(true);
          handleShowOption();
          setShowDeleteChat(true);
          break;
        case "Block":
          setToggleOption(true);
          handleShowOption();
          setShowBlock(true);
          break;
        case "Exit Group":
          setToggleOption(true);
          handleShowOption();
          setShowExitGroup(true);
          break;
        case "Make  group admin":
          makeAdmin(chatId, handleShowOption);
          setToggleOption(false);
          break;
        case "Dismiss admin":
          dismissAdmin(chatId, handleShowOption);
          setToggleOption(false);
          break;
        case "Remove":
          removeUser(chatId,handleShowOption);
          setToggleOption(false);
          break;

        default:
          console.log("Default");
          break;
      }
    };


    return (
      <>
        <div ref={ref} style={css} className="contentMenu">
          {options?.map((option, index) => (
            <div
              onClick={() => handleClick(option)}
              key={index}
              className="option"
            >
              <h5 >
                {option}
              </h5>
            </div>
          ))}
        </div>
      </>
    );
  }
);

export default OptionMenu;
