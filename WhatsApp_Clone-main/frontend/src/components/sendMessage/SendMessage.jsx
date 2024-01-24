import React, { useState } from "react";
import './style.scss';
import { SocketState } from "../../context/SocketContext";
import { ChatState } from "../../context/ChatContext";
import { TypingState } from "../../context/typingContext";

const SendMessage = ({hasMsg,message,setMessage}) => {
  const { socketConnected, passSocket } = SocketState();
  const {sender} = ChatState();
  const {typing,setTyping} = TypingState();
  const handleInput = (e)=>{
    const {value} = e.target;
    hasMsg(value);
    setMessage(value);
    if(!socketConnected) return;
    if(!typing){
      // console.log(sender);
      setTyping(true);
      const roomId = sender.chatId ?? sender._id;
      passSocket.emit("typing", roomId);
    }
    // Debouncing function 
    const lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiffrence = timeNow - lastTypingTime;
      if(timeDiffrence >= timerLength && typing){
      const roomId = sender.chatId ?? sender._id;
        passSocket.emit("stop typing",roomId);
        setTyping(false);
      }
    },timerLength)
  }
  // const handleKey = (e) =>{
  //   e.ctrlKey && e.keyCode === 13 &&  
  // }
  return (
    <>
        <textarea className="sendMsg"  name="message" placeholder = "Type a message" value = {message} onInput={handleInput} ></textarea>
    </>
  );
};

export default SendMessage;
