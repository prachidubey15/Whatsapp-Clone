import React, { useRef, useState } from "react";
import "./style.scss";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsCameraFill } from "react-icons/bs";
import { Detail } from "../exportComponents";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({location}) => {
  const { setShowProfile } = ShowStates();
  const { userInfo,setUserInfo } = UserInfoState();
  const dpInput = useRef();
  const dpSubmitBtn = useRef();
  const [dp, setDp] = useState();
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo?.jwttoken}`
    },
  };

  const handleClick = () => {
    setShowProfile(false);
    if(location && location.pathname === '/profile') navigate('/chat');
  };

  const handleOpenSelectDp = () => {
    dpInput.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setDp(file);
    
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("dp", dp);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/user/changeDp/${userInfo?._id}`,
        formData,
        config
      );
      setUserInfo(data);
      localStorage.setItem("userInfo",JSON.stringify(data));

    } catch (error) {
      console.log(error);
      return error;
    }
    // changeDp(userInfo._id);
  };

  if(dp){
    handleSubmit();
    setDp(null);
  }

  return (
    <>
      <div className="editProfile">
        <div className="heading">
          <AiOutlineArrowLeft onClick={handleClick} />
          <h1>Profile</h1>
        </div>

        {/* Show DP */}
        <div onClick={handleOpenSelectDp} className="image">
          <div className="overlay">
            <BsCameraFill />
            <h5>
              CHANGE
              <br />
              PROFILE PHOTO
            </h5>
          </div>
          <img
            src={userInfo ? `http://127.0.0.1:5000/api/user/show-dp/${userInfo?.profilePic}`:""}
            alt="DP"
          />
        </div>

        {/* uploadDp */}
        <div style={{ display: "none" }} >
          <input
            onChange={handleChange}
            ref={dpInput}
            type="file"
            name="dp"
            id="dp"
          />
          {/* <input ref={dpSubmitBtn} onClick={handleSubmit} /> */}
        </div>
        {userInfo && <Detail fieldName={'userName'} title={"Your name"} info={userInfo?.userName} />}
        <div className="note">
          <h6>
            This is not your username or pin.This name will be visible to your
            WhatsApp contacts.
          </h6>
        </div>
        {userInfo && <Detail fieldName={'about'} title={"About"} info={userInfo?.about} />}
      </div>
    </>
  );
};

export default Profile;
