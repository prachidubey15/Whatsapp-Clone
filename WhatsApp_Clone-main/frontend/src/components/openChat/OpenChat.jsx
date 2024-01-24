import React, { useEffect, useRef } from "react";
import {
  OpenChatNav,
  OpenChatBottom,
  ReceivedMsg,
  SendMsg,
} from "../exportComponents.js";
import "./style.scss";
import { ChatState } from "../../context/ChatContext.jsx";
import { UserInfoState } from "../../context/UserInfoContext.jsx";
import { showFirstDp } from "../../utils/group.js";
import { msgTimeDivider } from "../../utils/msg.js";

const OpenChat = ({ socket }) => {
  const { sender, allMessages } = ChatState();
  const { userInfo } = UserInfoState();
  const refBottom = useRef(null);
  
  useEffect(() => {
    refBottom.current.scrollIntoView();
  });
  return (
    <>
      <div className="openChatWrapper">
        <OpenChatNav socket={socket} sender={sender} />
        <div
          style={{ paddingLeft: sender?.inGroupChat ? "1.5rem" : null }}
          className="msgSection"
        >
          {/* <div style={{display:"flex",justifyContent:"center",position:"fixed" , top:"1rem",left:"50%"}}>Time</div> */}
          {allMessages?.map((msg, index) => (
            (msg.chat._id == sender.chatId || msg.chat._id==sender._id) && <>
              <div className="msgDivider">
                {msgTimeDivider(allMessages, index) &&
                <span>{msgTimeDivider(allMessages, index)}</span>}
              </div>
              {String(msg.sender._id) === String(userInfo?._id) ? (
                <SendMsg key={msg._id} msg={msg} />
              ) : (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    gap: msg.chat.inGroupChat ? "1rem" : null,
                  }}
                >
                  {msg.chat.inGroupChat && showFirstDp(allMessages, index) ? (
                    <div className="dp">
                      <img
                        src={`http://127.0.0.1:5000/api/user/show-dp/${msg.sender.profilePic}`}
                        alt="dp"
                      />
                    </div>
                  ) : (
                    <div className="dp"></div>
                  )}
                  <ReceivedMsg key={msg._id} msg={msg} />
                </div>
              )}
            </>
          ))}
          <span ref={refBottom} className="bottom"></span>
        </div>
        <OpenChatBottom socket={socket} />
      </div>
    </>
  );
};

export default OpenChat;
