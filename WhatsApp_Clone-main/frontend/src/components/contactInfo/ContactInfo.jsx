import React, { useState,useRef } from "react";
import "./style.scss";
import { IoClose, IoExitOutline } from "react-icons/io5";
import { MdBlock, MdDelete } from "react-icons/md";
import { ShowStates } from "../../context/ShowContext";
import { Contact, Detail } from "../exportComponents";
import { ChatState } from "../../context/ChatContext";
import { IoMdPersonAdd } from "react-icons/io";
import { BsCameraFill } from "react-icons/bs";
import axios from "axios";
import { UserInfoState } from "../../context/UserInfoContext";

const ContactInfo = () => {

  const {
    setShowContactInfo,
    setShowBlock,
    setShowDeleteChat,
    setShowExitGroup,
    setShowAddParticipants,
  } = ShowStates();
  const { sender,setSender,setChatName } = ChatState();
  const {userInfo} = UserInfoState();
  const [dp, setDp] = useState();
  const dpInput = useRef()
  const handleExitGroup = (name)=>{
    setShowExitGroup(true);
    setChatName(name);
  }
  const handleOpenSelectDp = () => {
    dpInput.current.click();
  };
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setDp(file);
  };
  const handleSubmit = async () => {
    // console.log(dp);
    const formData = new FormData();
    formData.append("groupIcon", dp);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.jwttoken}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group/changeDp/${sender._id}`,
        formData,
        config
      );
      // console.log(data);
      setSender(data);
      
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  if (dp) {
    handleSubmit();
    setDp(null);
  }
  // console.log(sender);
  // const optionStyleGenerator = (position)=>({...style,...position})

  return (
    <>
      <div className="contactInfo">
        <div className="heading">
          <IoClose
            onClick={() => setShowContactInfo(false)}
            style={{ fontSize: "1.4rem", color: "var(--iconColor)" }}
          />
          <h1>{sender.inGroupChat ? "Group info" : "Contact info"}</h1>
        </div>
        <div className="dets">
          <div className="image">
            {sender.inGroupChat ? (
              <>
                <div className="overlay" onClick={handleOpenSelectDp}>
                  <BsCameraFill />
                  <h5>
                    Add Group
                    <br />
                    Icon
                  </h5>
                </div>
                <div id="groupData">
                  <div style={{ display: "none" }} className="grpDp">
                    <input
                      className="changeDp"
                      type="file"
                      name="groupIcon"
                      ref={dpInput}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : null}
            <img
              src={`http://127.0.0.1:5000/api/user/show-dp/${
                sender.inGroupChat ? sender.chatDp : sender.profilePic
              }`}
              alt="image"
            />
          </div>
          {sender.inGroupChat ? (
            <Detail
              fieldName={"chatName"}
              info={sender.chatName}
              style={{
                fontSize: "1.5rem",
                fontWeight: "400",
                textAlign: "center",
              }}
            />
          ) : (
            <h3>{sender.userName}</h3>
          )}

          <h4>
            {sender.inGroupChat
              ? `Group . ${sender.users.length} participants`
              : sender.email}
          </h4>
        </div>
        <div className="about">
          <h6 className="title">
            {sender.inGroupChat ? "Group discription" : "About"}
          </h6>
          <h6 className="data">
            {sender.inGroupChat ? sender.description : sender.about}
          </h6>
        </div>

        {sender.inGroupChat ? (
          <>
            <div className="membersList">
              <h6 className="title">{`${sender.users.length} participants`}</h6>
              <div className="members">
                <div
                  onClick={() => setShowAddParticipants(true)}
                  className="addParticipant"
                >
                  <div className="addIcon">
                    <IoMdPersonAdd />
                  </div>
                  <h3>Add Participant</h3>
                </div>
                {sender.users?.map((participant) => (
                  <Contact
                    padding={{ padding: "0rem 1.4rem" }}
                    user={participant}
                    isParticipant={sender.groupAdmin}
                    // isadmin={{ id: participants._id, groupAdmin :sender}}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        <div className="options">
          {!sender.inGroupChat ? (
            <div onClick={() => setShowBlock(true)} className="block">
              <MdBlock style={{ color: "var(--red)", fontSize: "1.4rem" }} />
              <h3>{`Block ${sender.userName}`}</h3>
            </div>
          ) : (
            <div
              onClick={() => handleExitGroup(sender.chatName)}
              className="block"
            >
              <IoExitOutline
                style={{ color: "var(--red)", fontSize: "1.4rem" }}
              />
              <h3>Exit group</h3>
            </div>
          )}
          {sender.inGroupChat ? null : (
            <div onClick={() => setShowDeleteChat(true)} className="block">
              <MdDelete style={{ color: "var(--red)", fontSize: "1.4rem" }} />
              <h3>Delete Chat</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
