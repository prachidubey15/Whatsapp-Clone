import React, { useEffect, useState } from "react";
import "./style.scss";

import { AiFillCheckCircle, AiOutlineArrowLeft } from "react-icons/ai";
import { BsArrowRightCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { ShowStates } from "../../context/ShowContext";
import {
  Contact,
  InputGroupDetails,
  SelectedContact,
} from "../exportComponents";
import { UserInfoState } from "../../context/UserInfoContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { extractUsersId, uniqueUser } from "../../utils/group";
import { ChatState } from "../../context/ChatContext";

const NewGroup = ({ addParticipants }) => {
  const { allUsers, userInfo, setAllUsers } = UserInfoState();
  const {
    setShowNewGroup,
    setShowCreateNewGroup,
    showCreateNewGroup,
    setShowAddParticipants,
  } = ShowStates();
  const { sender,setSender } = ChatState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [hasGroupName, setHasGroupName] = useState();
  const [users,setUsers] = useState();

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
      data.sort();
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


  const manageUser = (id, allUsers) => {
    return allUsers.findIndex((user) => {
      return String(user._id) === String(id);
    });
  };

  const handleSelectUsers = (user) => {
    if (addParticipants) {
      const isUnique = uniqueUser(user._id, sender.users);
      if (isUnique === -1) {
        const index = manageUser(user._id, allUsers);
        const newUsers = [...allUsers];
        newUsers.splice(index, 1);
        setAllUsers(newUsers);
        setSelectedUser((pre) => [...pre, user]);
      }else{
        const registrationFail = () =>
          toast.error("You cannot add this user because this user already in the group", {
            position: toast.POSITION.TOP_CENTER,
          });
        registrationFail();
      }
    } else {
      const index = manageUser(user._id, allUsers);
      const newUsers = [...allUsers];
      newUsers.splice(index, 1);
      setAllUsers(newUsers);
      setSelectedUser((pre) => [...pre, user]);
    }
  };

  const handleDeselect = (id) => {
    const index = manageUser(id, selectedUser);
    const newSelectedUsers = [...selectedUser];
    const deselected = newSelectedUsers.splice(index, 1);
    setSelectedUser(newSelectedUsers);
    setAllUsers((pre) => [...allUsers, ...deselected]);
  };

  const handleCreateGroup = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
      },
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group/create`,
        hasGroupName,
        config
      );
      setShowCreateNewGroup(false);
      setShowNewGroup(false);
    } catch (error) {
      return error.message
    }
  };

  const handleShowInputGroupDetails = () => {
    if (selectedUser.length < 2) {
      const registrationFail = () =>
        toast.error("You have to select atleast 2 users to create a group", {
          position: toast.POSITION.TOP_LEFT,
        });
      registrationFail();
    } else {
      const ids = JSON.stringify(extractUsersId(selectedUser));
      setUsers(ids);
      setShowCreateNewGroup(true);
    }
  };

  const handleAddParticipant = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
    const participant = JSON.stringify(extractUsersId(selectedUser));
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/group/add-user/${sender._id}`,
        {
          email: userInfo.email,
          participants: participant,
        },
        config
      );
      setShowAddParticipants(false);
      setSender(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="newGroup">
        {showCreateNewGroup ? (
          <InputGroupDetails users={users} stateUplifter={setHasGroupName} />
        ) : (
          <>
            <div className="heading">
              <AiOutlineArrowLeft onClick={() => setShowNewGroup(false)} />
              <h1>Add group participants</h1>
            </div>
            <div className="search">
              <div className="selected">
                {selectedUser?.map((user) => (
                  <SelectedContact
                    onClick={handleDeselect}
                    key={user._id}
                    user={user}
                  />
                ))}
              </div>
              <input
                type="text"
                name="groupParticipants"
                id="participantSearch"
                placeholder="Type contact name"
              />
            </div>
            <div className="contactList">
              <ul>
                {allUsers?.map((user) => (
                  <li style={{ listStyle: "none" }} key={user._id}>
                    <Contact onClick={handleSelectUsers} user={user} />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        <div className="creategrp">
          {hasGroupName && showCreateNewGroup ? (
            <AiFillCheckCircle
              cursor={"pointer"}
              onClick={handleCreateGroup}
              color="var(--bgGreen)"
              fontSize={"2.9rem"}
            />
          ) : hasGroupName?.groupName ||
            showCreateNewGroup ? null : addParticipants ? (
            <BsCheckCircleFill
              cursor={"pointer"}
              color="var(--bgGreen)"
              fontSize={"2.5rem"}
              onClick={handleAddParticipant}
            />
          ) : (
            <BsArrowRightCircleFill
              onClick={handleShowInputGroupDetails}
              color="var(--bgGreen)"
              fontSize={"2.5rem"}
            />
          )}
        </div>
        <ToastContainer limit={1} />
      </div>
    </>
  );
};

export default NewGroup;
