import React, { useRef, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { CiFaceSmile } from "react-icons/ci";
import { FaUserGroup } from "react-icons/fa6";
import {BsCheckLg} from "react-icons/bs"

import "./style.scss";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { ShowStates } from "../../context/ShowContext";
import { UserInfoState } from "../../context/UserInfoContext";

const InputGroupDetails = ({ users,stateUplifter }) => {
  const { setShowCreateNewGroup } = ShowStates();
  const {userInfo} = UserInfoState();
  const [groupInfo, setGroupInfo] = useState();
  const [dp,setDp] = useState();
  const dpInput = useRef();

  

  const handleOpenSelectDp = () => {
    dpInput.current.click();
  };

  const handleGroupName = (e) => {
    setGroupInfo(e.target.value);
};

const handleChange = (e) => {
  const file = e.target.files[0];
  if (file) setDp(file);
};

const handleFormData = ()=>{
const formData = new FormData();
formData.append("groupName",groupInfo);
formData.append("users",users)
formData.append("email",userInfo.email)
console.log(dp);
if(dp)formData.append("groupIcon",dp);
stateUplifter(formData);
}

//  const handleSubmit = async (e) => {
//    // e.preventDefault();
//    const formData = new FormData();
//    formData.append("dp", dp);
//    formData.append("groupName");
//    try {
//      const { data } = await axios.post(
//        `http://localhost:5000/api/chat/group/create`,
//        formData,
//        config
//      );
//      // console.log(data);
//      setUserInfo(data);
//    } catch (error) {
//      return error;
//    }
//    // changeDp(userInfo._id);
//  };

//  if (dp && groupInfo) {
//    handleSubmit();
//    setDp(null);
//  }

  return (
    <div className="grpDetailsWrapper">
      <div className="heading">
        <>
          <AiOutlineArrowLeft
            fontSize={"1.4rem"}
            color="var(--white)"
            onClick={() => setShowCreateNewGroup(false)}
          />
          <h1 style={{ fontWeight: "600", fontSize: "1.2rem" }}>New group</h1>
        </>
      </div>
      <div className="inpImage" onClick={handleOpenSelectDp}>
        <div className="overlay">
          <BsCameraFill />
          <h5>
            Add Group
            <br />
            Icon
          </h5>
        </div>
        <FaUserGroup className="grp" />
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
        <div className="grpName">
          <input
            onChange={handleGroupName}
            type="text"
            name="groupName"
            placeholder="Group Subject"
            value={groupInfo?.groupName}
          />
          <CiFaceSmile fontSize={"1.2rem"} cursor={"pointer"} />
          {
            groupInfo?
          <BsCheckLg onClick={handleFormData} fontSize={"1.2rem"} color={"var(--bgGreen)"} cursor={"pointer"} />:null
          }
        </div>
      </div>
    </div>
  );
};

export default InputGroupDetails;
