import React, { useRef, useState } from "react";
import "./style.scss";
import { MdEdit } from "react-icons/md";
import { BsCheckLg } from "react-icons/bs";
import { CiFaceSmile } from "react-icons/ci";
import axios from "axios";
import { UserInfoState } from "../../context/UserInfoContext";
import { ChatState } from "../../context/ChatContext";

const Detail = ({ title, info, style, fieldName }) => {
  const editModeRef = useRef();
  const infoRef = useRef();
  const [isEditMode, setMode] = useState(false);
  const { userInfo,setUserInfo } = UserInfoState();
  const { sender, setSender } = ChatState();
  const [value, setValue] = useState({
    [fieldName]:info
  });
  
  const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.jwttoken}`,
        "Content-type": "application/json",
      },
    };
  const renameGroup = async(chatId,chatName)=>{
    
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/group/rename/`,
        { email: userInfo?.email, chatId, chatName },
        config
      );
      if (typeof data === "object") setSender(data);
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
  }
  const updateDetails= async()=>{
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/user/updateDetails`,
        { ...value, email: userInfo?.email },
        config
      );
      console.log(data);
      if (typeof data === "object"){
        setUserInfo(data);
        localStorage.setItem('userInfo',JSON.stringify(data));
      }
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
  }
  const toggleMode = () => {
    if (style && value.chatName !== info) renameGroup(sender._id, value.chatName);
    if((fieldName === 'userName' && value.userName !== info )|| (fieldName === 'about'&& value.about !== info))updateDetails();
    setMode(!isEditMode);
    if (isEditMode) {
      editModeRef.current.style.display = "flex";
      infoRef.current.style.display = "none";
    } else {
      editModeRef.current.style.display = "none";
      infoRef.current.style.display = "flex";

    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  const { userName, about, chatName } = value;

  return (
    <>
      <div className="details">
        <div className="title">
          <h6>{title}</h6>
        </div>
        <div className="data">
          <div ref={editModeRef} className="editMode">
            <input
              name={fieldName}
              type="text"
              value={userName?userName:about?about:chatName}
              onChange={handleChange}
            />
            <div className="icons">
              <CiFaceSmile cursor={"pointer"} />
              <BsCheckLg cursor={"pointer"} onClick={toggleMode} />
            </div>
          </div>
          <div
            style={style ? { textAlign: "center" } : null}
            ref={infoRef}
            className="info"
          >
            <h6 style={style}>{value?.userName?userName:about?about:chatName}</h6>
            {/* {!(value.userName || value.about) &&<h6 style={style}>{info}</h6>} */}
            <div className="icons">
              <MdEdit cursor={"pointer"} onClick={toggleMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
