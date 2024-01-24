import React from "react";
import "./style.scss";

import { IoIosClose } from "react-icons/io";
const SelectedContact = ({user,onClick}) => {
  return (
    <>
      <div className="selectedContact">
        <div className="dp">
          <img
            src={`http://127.0.0.1:5000/api/user/show-dp/${user.profilePic}`}
            alt="dp"
          />
        </div>
        <div className="username">
          <h5>{user.userName}</h5>
        </div>
        <div onClick={()=>onClick(user._id)} className="icon">
          <IoIosClose color="var(--profileIcon)" fontSize={"1.2rem"} />
        </div>
      </div>
    </>
  );
};

export default SelectedContact;
