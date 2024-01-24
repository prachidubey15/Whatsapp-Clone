import React, { useEffect, useRef, useState } from "react";
import { GiPin } from "react-icons/gi";
import { FiChevronDown } from "react-icons/fi";

import "./style.scss";
import { UserDp } from "../exportComponents";
import { findSender } from "../../utils/findSender";
import { UserInfoState } from "../../context/UserInfoContext";
import { ChatState } from "../../context/ChatContext";
import { ShowStates } from "../../context/ShowContext";
import { lastMsgTime } from "../../utils/msg";

const MsgBox = ({ data, onClick, socket, allMsg }) => {
  const [openMsg, setOpenMsg] = useState();
  const { userInfo } = UserInfoState();
  const senderDetails = findSender(data.users, userInfo._id);
  const {
    setSender,
    sender,
    allMessages,
    notification,
    setNotification,
    notificationChat,
  } = ChatState();
  const { setShowContactInfo } = ShowStates();
  const [msg, setMsg] = useState();

  useEffect(() => {
    allMsg
      .then((valueArray) => {
        setMsg(valueArray)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [sender,allMessages,notificationChat]);

  const handleOpenChat = () => {
    socket.emit("joinChat", data._id);
    notification && setNotification((pre)=>{
      pre.delete(data._id);
      return pre;
    });
    setSender(() =>
      data.inGroupChat ? data : { chatId: data._id, ...senderDetails }
    );
    setShowContactInfo(false);
    onClick(true);
  };

  return (
    <>
      <div
        onClick={handleOpenChat}
        style={
          String(sender?.chatId) === String(data._id) ||
          String(sender?._id) === String(data._id)
            ? { backgroundColor: "var(--openmsg" }
            : {}
        }
        className="msgBox"
      >
        <UserDp
          dpImg={data.inGroupChat ? data.chatDp : senderDetails.profilePic}
        />
        <div className="textBox">
          <div className="name">
            <h5>
              {data.inGroupChat ? data?.chatName : senderDetails.userName}
            </h5>
            <h6>{lastMsgTime(msg && msg[msg.length - 1]?.createdAt)}</h6>
          </div>
          <div className="msg">
            {msg ? (
              <h6
                style={{
                  fontWeight: `${
                    notification?.get(data._id)?.length > 0 ? 900 : 500
                  }`,
                  fontSize: ".8rem",
                  color: `${
                    notification.get(data._id)?.length > 0
                      ? "var(--iconColor)"
                      : "var(--lighttext)"
                  }`,
                }}
              >
                {msg[msg.length - 1]?.content}
              </h6>
            ) : null}
            {notification.get(data._id)?.length > 0 && (
              <div className="notify">{notification.get(data._id)?.length}</div>
            )}
            {/* <div className="msgIcon">
              <GiPin color={"var(--lighttext)"} fontSize={"1rem"} />
              <FiChevronDown color={"var(--lighttext)"} fontSize={"1.4rem"} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MsgBox;
