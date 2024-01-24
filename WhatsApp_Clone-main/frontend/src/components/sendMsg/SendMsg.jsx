import React from "react";
import "./style.scss";
import { timeGenerator } from "../../utils/msg";

const SendMsg = ({msg}) => {
  return (
    <>
      <div className="singleMsg">
        <div className="msgdiv">
          <h5>{msg.content}</h5>
          <div className="time">
            <span className="blank"></span>
            <span className="data">
              {timeGenerator(msg?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendMsg;
