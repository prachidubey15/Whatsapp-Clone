import React from "react";
import { logoRight } from "../../assets/exportAssets";
import { BiSolidLockAlt } from "react-icons/bi";

import "./style.scss";

const CloseChat = () => {
  return (
    <>
      <div className="main">
        <img src={logoRight} alt="logo" />
        <h1>WhatsApp Web</h1>
        <p>
          Send and receive messages without keeping your phone online. <br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>
        <div className="encryption">
          <BiSolidLockAlt />
          <h6>End-to-end encrypted</h6>
        </div>
      </div>
    </>
  );
};

export default CloseChat;
