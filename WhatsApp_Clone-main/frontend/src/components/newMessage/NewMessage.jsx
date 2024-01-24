import React, { useEffect, useState } from "react";
import '../newGroup/style.scss';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ShowStates } from "../../context/ShowContext";
import { Contact, SearchBar } from "../exportComponents";
import { FaUserGroup } from "react-icons/fa6";
import axios from "axios";
import { UserInfoState } from "../../context/UserInfoContext";
import { ChatState } from "../../context/ChatContext";
import { findSender } from "../../utils/findSender";

const NewMessage = ({addParticipants}) => {

  const { setShowNewMessage, setShowNewGroup, setShowOpenChat } = ShowStates();
  const { allUsers, userInfo, setAllUsers } = UserInfoState();
  const {setSender} = ChatState();
  const [result,setResult] = useState();

  const createChatOrFindChat = async (user) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { email: userInfo?.email, userId: user._id },
        config
      );
      const senderDetails = findSender(data?.users, userInfo._id);
      setSender(senderDetails);
      setShowOpenChat(true);
      setShowNewMessage(false);
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

  const searchUser = async (search) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        email: userInfo?.email,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/?search=${search}`,
        config
      );
      data?.sort((a, b) => a.userName.localeCompare(b.userName));
        setResult(data);
      // setAllChats(data);
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

  const fetchAllUsers = async (email) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/allusers",
        { email },
        config
      );
      data?.sort((a, b) => a.userName.localeCompare(b.userName));
      setAllUsers(data);
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
  useEffect(() => {
    fetchAllUsers(userInfo.email);
  }, []);

  return (
    <>
      <div className="newGroup">
        <div className="heading">
          <AiOutlineArrowLeft onClick={() => setShowNewMessage(false)} />
          <h1>New chat</h1>
        </div>
        <div style={{ padding: "1rem 1.6rem" }} className="search">
          <SearchBar find={searchUser} />
        </div>
        <div onClick={() => setShowNewGroup(true)} className="options">
          <div className="icons">
            <div className="container">
              <FaUserGroup fontSize={"1.5rem"} color={"var(--white)"} />
            </div>
          </div>
          <div className="title">
            <h3>New group</h3>
          </div>
        </div>
        <div className="contactList">
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "400",
              color: "var(--bgGreen)",
              margin: "2rem",
              overflowY:"auto"
            }}
          >
            CONTACTS ON WHATSAPP
          </h3>
          <ul style={{listStyle:"none"}}>
            {result
              ? result?.map((user) => (
                  <li key={user._id}>
                    <Contact onClick={createChatOrFindChat} user={user} />
                  </li>
                ))
              : allUsers?.map((user) => (
                  <li key={user._id}>
                    <Contact onClick={createChatOrFindChat} user={user} />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NewMessage;
