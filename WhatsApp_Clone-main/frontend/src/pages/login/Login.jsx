import './style.scss';
import {CustomButton} from '../../components/exportComponents'
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials,setCredential] = useState({
    email:"",
    password:""
  });

  const fillDetails = () =>
    toast.error("Fill all the details!", {
      position: toast.POSITION.TOP_CENTER,
    });

    const navigate = useNavigate()
  const handleChange =  (e)=>{
   const {name,value} = e.target;
   setCredential((pre)=>{
    return{
      ...pre,[name]:value
    }
   })
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const {email,password} = credentials;
    if(!email || !password){
      fillDetails();
    }
    else{
            //sending data to backend
      const config ={
        headers:{
          'Content-type':'application/json',
        },
      };
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/user/login",
          { email, password },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        setCredential({
          email:"",
          password:""
        })
        navigate("/chat");
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
    // console.log(credentials);
  }
  return (
    <>
      <div className="container">
        <header>Log in</header>
        <h5>Enter your login credentials</h5>
        <form id="login" onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
          />
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </form>
        <CustomButton form={"login"} type={"submit"}>
          Login
        </CustomButton>
        <ToastContainer limit={1} />;
      </div>
    </>
  );
};

export default Login;
