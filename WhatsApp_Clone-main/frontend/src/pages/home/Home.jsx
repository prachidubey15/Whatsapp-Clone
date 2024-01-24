import React, { useState } from "react";
import './style.scss'

import {logo} from '../../assets/exportAssets'

import {Card,Loader} from '../../components/exportComponents'

const Home = () => {
  const [isLoading,setIsLoading] = useState(false);
  // localStorage.removeItem("userInfo");
  return (
    <>
    {
      isLoading?(
      <Loader />
      ):(
      <div>
        <div className="top">
          <div className="container">
            <div className="header">
              <img className="logo" src={logo} alt="logo" />
              <h5>WHATSAPP WEB</h5>
            </div>
            <Card />
          </div>
        </div>
        <div onClick={()=>{setIsLoading(true)}} className="bottom"></div>
      </div>
      )
    }
    </>
  );
};

export default Home;
