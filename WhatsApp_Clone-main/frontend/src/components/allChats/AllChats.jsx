import React, { useEffect, useState } from "react";
import { BsFilter } from "react-icons/bs";
import "./style.scss";

import {
  MsgBox,
  ChatNavbar,
  SearchBar,
  Loader,
} from "../../components/exportComponents";
import { UserInfoState } from "../../context/UserInfoContext";
import axios from "axios";
import { ShowStates } from "../../context/ShowContext";
import { ChatState } from "../../context/ChatContext";


const AllChats = ({socket}) => {
  const { userInfo } = UserInfoState();
  const { setShowOpenChat } = ShowStates();
  const { allChats, setAllChats,sender,allMessages } = ChatState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [allChatsSearch,setAllChatsSearch] = useState();

  const getAllChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        Email: userInfo?.email,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/chat/",
        config
      );
      setAllChats(data);
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

  const getAllMessage = async (chatId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
        email: userInfo?.email,
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${chatId}`,
        config
      );
      return data;
      // console.log(data);
      // setAllMsg(data);
    } catch (error) {
      return error;
    }
  };

  useEffect(()=>{
    getAllChats();
  },[sender,allMessages]);

  if (!allChats) {
    getAllChats();
  };
  
  const searchInExistingChat = async (search) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        email: userInfo?.email,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/chat/search?search=${search}`,
        config
      );
      setSearchResult(data);
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

  return (
    <>
      <ChatNavbar />
      <div
        style={{ borderBottom: "1px solid var(--openmsg)" }}
        className="searchNav"
      >
        <SearchBar
          find={searchInExistingChat}
          searchState={setAllChatsSearch}
        />
        <BsFilter fontSize={"1.3rem"} color="var(--lighttext)" />
      </div>

      {isLoading ? (
        <div className="loader" style={{ width: "25.7rem", height: "83%" }}>
          <Loader />
        </div>
      ) : (
        <div className="chats">
          {allChatsSearch
            ? searchResult?.map((chat) => (
                <MsgBox
                  socket={socket}
                  data={chat}
                  key={chat._id}
                  onClick={setShowOpenChat}
                />
              ))
            : allChats?.map((chat) => {
              const msgs = getAllMessage(chat._id); 
                return <MsgBox
                  socket={socket}
                  data={chat}
                  key={chat._id}
                  onClick={setShowOpenChat}
                  allMsg ={msgs}
                />
          })}
        </div>
      )}
    </>
  );
};

export default AllChats;
