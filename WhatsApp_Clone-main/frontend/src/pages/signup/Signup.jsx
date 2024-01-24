import React, { useRef, useState } from "react";
import { useNavigate} from 'react-router-dom';
import './style.scss';
import {CustomButton} from '../../components/exportComponents'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  //Variable
  const initial = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  //Hooks
  const cnfrmPasswordInput = useRef();
  const submitBtn = useRef();
  const navigate  = useNavigate();
  const [userDetail,setUserDetail] = useState(initial);

  //Toasts
  const registered = () =>
    toast.success("Registered successfully!!!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  const fillDetails = () =>
    toast.error("Fill all the details!", {
      position: toast.POSITION.TOP_CENTER,
    });
  const strongPassword = () =>
    toast.error("Enter strong password of atleast 8 charactars in password field", {
      position: toast.POSITION.TOP_CENTER,
      toastId: "strongPassword",
    });


  const handleChange = (e)=>{
     const {name,value} = e.target
     if (name === 'confirmPassword') {
      const match = userDetail.password;
      if (match.length<8) {
      toast.clearWaitingQueue({ containerId: "strongPassword" });
        strongPassword();
        submitBtn.current.setAttribute("disabled", true);
        submitBtn.current.style.opacity = "0.5";
        submitBtn.current.style.cursor = "none";
      }
      if (match !== value.trim()) {
        cnfrmPasswordInput.current.style.borderColor = 'red';
        submitBtn.current.setAttribute("disabled", true);
        submitBtn.current.style.opacity = '0.5'
        submitBtn.current.style.cursor = 'none'
      }
      else{
        cnfrmPasswordInput.current.style.borderColor = "#8696A0";
        submitBtn.current.removeAttribute("disabled");
        submitBtn.current.style.opacity = "1";
        submitBtn.current.style.cursor = "pointer";
      }
     }
    setUserDetail((preValue) => {
      return {
        ...preValue,
        [name]: value.trim(),
      };
    });
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {userName,email,password}=userDetail;
    if (!userName || !email || !password) {
      toast.clearWaitingQueue();
      fillDetails() //toster
    }
    else{
      toast.clearWaitingQueue();
      //sending data to backend
      const config ={
        headers:{
          'Content-type':'application/json',
        },
      };
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/user/signup",
          { userName, email, password },
          config
        );
        registered();
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserDetail(initial);
        navigate("/profile");
      } catch (error) {
        const registrationFail = () =>
          toast.error(`${error?.response?.data}`, {
            position: toast.POSITION.TOP_CENTER,
            toastId: "registrationFail",
          });
        registrationFail();
        return error
      }
      
    }
  }

  return (
    <>
      <div className="container">
        <header>Sign Up</header>
        <h5>Enter your details</h5>
        <form id="signup" onSubmit={handleSubmit}>
          <input
            id="username"
            type="text"
            name="userName"
            value={userDetail.userName}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            id="email"
            type="email"
            name="email"
            value={userDetail.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            id="password"
            type="password"
            name="password"
            value={userDetail.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={userDetail.confirmPassword}
            onChange={handleChange}
            ref={cnfrmPasswordInput}
            placeholder="Confirm Password"
            required
          />
        </form>
        <CustomButton
          ref={submitBtn}
          form={"signup"}
          type={"submit"}
        >
          Signup
        </CustomButton>
        <ToastContainer limit={1} />;
        
      </div>
    </>
  );
};

export default Signup;
