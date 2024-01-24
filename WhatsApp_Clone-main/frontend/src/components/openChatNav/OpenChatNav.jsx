import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import "./style.scss";
import { ProfileDp, OptionMenu } from "../exportComponents.js";
import { AiOutlineSearch } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { ShowStates } from "../../context/ShowContext";
import { participantsName } from "../../utils/group";
import { TypingState } from "../../context/typingContext";
import typing from '../../assets/typing.json';

const OpenChatNav = ({ sender,socket }) => {
  
  const [toggleOption, setToggleOption] = useState(false);
  const optionMenuRef = useRef();
  const shadowRef = useRef();
  const {setShowContactInfo} = ShowStates();
  const {isTyping,setIsTyping} = TypingState();
useEffect(()=>{
  socket.on("typing", () => setIsTyping(true));
  socket.on("stop typing", () => setIsTyping(false));
},[])
  const optionGenerator = (isGroup) => {
    const groupOption = [
      "Group info",
      "Close chat",
      "Clear messages",
      "Exit Group",
    ];
    const chatOption = ["Contact info", "Close chat", "Delete chat", "Block"];
    return isGroup ? groupOption : chatOption;
  };
  const options = optionGenerator(sender.inGroupChat);


  const handleShowOption = (e) => {
    setToggleOption((prev) => !prev);
    if (!toggleOption) {
      shadowRef.current.style.backgroundColor = "#dadada";
      optionMenuRef.current.style.display = "initial";
    } else {
      shadowRef.current.style.backgroundColor = "transparent";
      optionMenuRef.current.style.display = "none";
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typing,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <div className="openChatNavbar">
        <div onClick={() => setShowContactInfo(true)} className="left">
          <ProfileDp
            dpImg={sender.inGroupChat ? sender.chatDp : sender.profilePic}
          />
          <div className="groupInfo">
            <h6>{sender.inGroupChat ? sender.chatName : sender.userName}</h6>
            {isTyping && (
              <div style={{ display: "flex",fontSize:"0.9rem",fontWeight:"600" }}>
                Typing
                <div style={{marginLeft:"-0.8rem",height:"0.8rem",marginTop:"-0.25rem"}}>
                  <Lottie options={defaultOptions} height={40} width={40} />
                </div>
              </div>
            )}
            {sender.inGroupChat && !isTyping ? (
              <div
                title={participantsName(sender.users).reduce(
                  (acc, cv) => acc + cv
                )}
                className="participants"
              >
                {sender.users?.map((participant, index) => {
                  let name = participant.userName;
                  if (index < sender.users.length - 1) {
                    name += ", ";
                  }
                  return name;
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div className="right">
          <AiOutlineSearch />
          <div className="optionContainer">
            <div className="moreBg" ref={shadowRef}>
              <SlOptionsVertical onClick={handleShowOption} />
            </div>
            <OptionMenu
              ref={optionMenuRef}
              options={options}
              handleShowOption={handleShowOption}
              setToggleOption={setToggleOption}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenChatNav;
