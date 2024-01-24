import React from "react";
import "./style.scss";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";

const ProfileDp = ({ dpImg }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // const {userInfo} = UserInfoState();
  const { setShowProfile } = ShowStates();
  const handleClick = () => {
    setShowProfile(true);
  };
  return (
    <>
      <div onClick={handleClick} className="profileDp">
        <img src={`http://127.0.0.1:5000/api/user/show-dp/${dpImg?dpImg:userInfo.profilePic}`} alt="Profile DP" />
      </div>
    </>
  );
};

export default ProfileDp;
