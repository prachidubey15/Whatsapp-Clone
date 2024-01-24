import React, { useEffect, useState } from "react";
import { SendMessage } from "../exportComponents";
import { CiFaceSmile } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { MdOutlineMic } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import "./style.scss";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";
import axios from "axios";
import { ChatState } from "../../context/ChatContext";
import { SocketState } from "../../context/SocketContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OpenChatBottom = ({ socket }) => {
  const [showSendBtn, setShowSendBtn] = useState(false);
  const { showContactInfo } = ShowStates();
  const { userInfo } = UserInfoState();
  const {
    sender,
    allMessages,
    setAllMessages,
    notification,
    setNotification,
    setNotificationChat,
  } = ChatState();
  const [message, setMessage] = useState("");
  let compareSelectedChat;

  const hasMsg = (msg) => {
    msg === "" ? setShowSendBtn(false) : setShowSendBtn(true);
  };

  const getAllMessage = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
        email: userInfo?.email,
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${sender.chatId ?? sender._id}`,
        config
      );
      setAllMessages(data);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    socket.on("msg received", (msg) => {
      compareSelectedChat = sender;
      if (
        (msg.chat.inGroupChat &&
          (String(compareSelectedChat._id) === String(msg.chat._id))) ||
        (!msg.chat.inGroupChat &&
          (String(compareSelectedChat.chatId) === String(msg.chat._id)))
      ) {
        notification?.has(msg.chat._id) &&
          setNotification((pre) => {
            pre.delete(msg.chat._id);
            return pre;
          });
        // console.log("Recived");
        setAllMessages((pre) => [...pre, msg]);
      } else {
        const newMessage = () =>
          toast.success(
            `New Message from : ${msg?.sender.userName}
            ${msg.content}`,
            {
              position: toast.POSITION.TOP_RIGHT,
              toastId: "newMessage",
            }
          );
        if (notification?.has(msg.chat._id)) {
          const pre = notification.get(msg.chat._id);
          !pre.includes(msg) && setNotification(notification.set(msg.chat._id, [...pre, msg]));
        } else {
          setNotification(notification.set(msg.chat._id, [msg]));
        }
        setNotificationChat(notification.get(msg.chat._id));
        newMessage();
        // console.log("notify");
      }
    });
    getAllMessage();
    setMessage("");
  }, [sender]);

  const handleClick = async () => {
    socket.emit("stop typing", sender.chatId ?? sender._id);
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
    if (message) {
      try {
        const body = {
          email: userInfo?.email,
          chat: sender.chatId ?? sender._id,
          content: message,
        };
        setMessage("");
        const { data } = await axios.post(
          `http://localhost:5000/api/message/`,
          body,
          config
        );
        socket.emit("newMessage", data);
        setAllMessages([...allMessages, data]);
      } catch (error) {
        return error;
      }
    }
  };

  

  return (
    <>
      <div
        style={{
          width: showContactInfo
            ? "calc(100vw - 51.4rem)"
            : "calc(100vw - 25.7rem)",
        }}
        className="openChatBottom"
      >
        <div className="left">
          <CiFaceSmile />
          <FiPlus />
        </div>
        <SendMessage
          hasMsg={hasMsg}
          message={message}
          setMessage={setMessage}
        />
        <div className="right">
          {showSendBtn ? (
            <IoSendSharp fontSize={"1.6rem"} onClick={handleClick} />
          ) : (
            <MdOutlineMic />
          )}
        </div>
        <ToastContainer limit={1} />
      </div>
    </>
  );
};

export default OpenChatBottom;
