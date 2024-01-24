import React, { useEffect, useState } from "react";
import "./style.scss";

import {
  AllChats,
  CloseChat,
  ContactInfo,
  OpenChat,
  Setting,
  Profile,
  NewGroup,
  NewMessage,
  Logout,
  AddParticipants,
} from "../../components/exportComponents.js";
import { ShowStates } from "../../context/ShowContext";
import UserInfoProvider from "../../context/UserInfoContext";
import ChatProvider from "../../context/ChatContext";
import DataProvider from "../../context/SearchContext";
import SearchProvider from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

import { io } from "socket.io-client";
import { TypingState } from "../../context/typingContext";
import { SocketState } from "../../context/SocketContext";

const endPoint = "http://localhost:5000";

const Chat = () => {
  var { setSocketConnected, socket } = SocketState();
  const { passSocket, setPassSocket } = SocketState();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isTyping,setIsTyping } = TypingState();

  useEffect(() => {
    socket = io(endPoint);
    socket.emit("setUp", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));
    socket && setPassSocket(socket);
  }, []);

  const {
    showProfile,
    showSetting,
    showLogout,
    showNewMessage,
    showNewGroup,
    showContactInfo,
    showOpenChat,
    showDeleteChat,
    showBlock,
    showExitGroup,
    showAddParticipants,
    showCreateNewGroup,
  } = ShowStates();

  return (
    <UserInfoProvider>
      <ChatProvider>
        <SearchProvider>
          <div className="chatWrapper">
            {showLogout ? (
              <Logout option={"Log out"} />
            ) : showDeleteChat ? (
              <Logout option={"Delete chat"} />
            ) : showBlock ? (
              <Logout option={"Block"} />
            ) : showExitGroup ? (
              <Logout option={"Exit group"} />
            ) : showAddParticipants ? (
              <AddParticipants />
            ) : null}
            <div className="chatLeft">
              {showProfile ? (
                <Profile />
              ) : showSetting ? (
                <Setting />
              ) : showNewGroup ? (
                <NewGroup />
              ) : showNewMessage ? (
                <NewMessage />
              ) : (
                <AllChats socket={passSocket} />
              )}
            </div>
            <div className="chatRight">
              {showOpenChat ? <OpenChat socket={passSocket} /> : <CloseChat />}
            </div>
            {showContactInfo ? (
              <div className="drawer">
                <ContactInfo />
              </div>
            ) : null}
          </div>
        </SearchProvider>
      </ChatProvider>
    </UserInfoProvider>
  );
};

export default Chat;
