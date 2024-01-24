import React from "react";
import './style.scss';

import { AiOutlineArrowLeft } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import { MdLightMode, MdModeNight, MdWallpaper } from "react-icons/md";
import { UserInfoState } from "../../context/UserInfoContext";
import { ShowStates } from "../../context/ShowContext";

const Setting = () => {
    const {userInfo} = UserInfoState();
    const {setShowSetting,setShowLogout} = ShowStates();
    const handleLogout = (e)=>{
      e.stopPropagation(); 
      setShowLogout(true)
    }
  return (
    <>
      <div className="setting">
        <div className="heading">
          <AiOutlineArrowLeft onClick={() => setShowSetting(false)} />
          <h1>Setting</h1>
        </div>
        <div className="profile">
          <div className="dp">
            <img
              src={`http://127.0.0.1:5000/api/user/show-dp/${userInfo?.profilePic}`}
              alt="dp"
            />
          </div>
          <div className="content">
            <h3>{userInfo?.userName}</h3>
            <h5>{userInfo.about} </h5>
          </div>
        </div>
        <div className="options">
          <div className="icons">
            <MdLightMode fontSize={"1.8rem"} color={"var(--profileIcon)"} />
            {/* <MdModeNight fontSize={'2rem'} color={"var(--profileIcon)"} /> */}
          </div>
          <div className="title">
            <h3>Theme</h3>
          </div>
        </div>
        <div className="options">
          <div className="icons">
            <MdWallpaper fontSize={"1.3rem"} color={"var(--profileIcon)"} />
          </div>
          <div className="title">
            <h3>Chat wallpaper</h3>
          </div>
        </div>
        <div onClick={handleLogout} className="options">
          <div className="icons">
            <TbLogout fontSize={"1.3rem"} color={"var(--red)"} />
          </div>
          <div className="title">
            <h3 style={{ color: "var(--red)" }}>Log out</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
