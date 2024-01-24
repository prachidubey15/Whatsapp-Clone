import React from "react";
import "./style.scss";
import { ChatState } from "../../context/ChatContext";
import { timeGenerator } from "../../utils/msg";

const ReceivedMsg = ({ msg }) => {
  const { sender } = ChatState();
  return (
    <>
      <div className="singleReceivedMsg">
        <div className="msgdiv">
          {sender.inGroupChat ? (
            <div className="name">
              <h4>{msg.sender.userName}</h4>
            </div>
          ) : null}
          <div className="msgs">
            <h5>{msg.content}</h5>
            <div className="time">
              <span className="blank"></span>
              <span className="data">{timeGenerator(msg?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceivedMsg;
