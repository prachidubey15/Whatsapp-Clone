import React from "react";
import './style.scss';
import { UserInfoState } from "../../context/UserInfoContext";

const UserDp = ({dpImg}) => {
  const {userInfo} = UserInfoState();
  return(
    <>
        <div className="userDp">
            <img src={`http://127.0.0.1:5000/api/user/show-dp/${dpImg}`} alt="UserDP" />
        </div>
    </>
  );
};

export default UserDp;
