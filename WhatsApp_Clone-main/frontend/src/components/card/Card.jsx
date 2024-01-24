import React, { useState } from "react";
import "./style.scss";
import { CustomButton } from "../exportComponents";
import {Login,Signup} from '../../pages/exportPage'

const Card = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  return (
    <>
      <div className="card">
      {
        isLoginPage?(<Login />):(<Signup />)
      }
        
        <h5 onClick={() => setIsLoginPage(!isLoginPage)} className="links">
          {isLoginPage?"click here to sign up" : "click here to login"}
        </h5>
      </div>
    </>
  );
};

export default Card;
