import React from "react";
import './style.scss';

import { loader } from "../../assets/exportAssets";

const Loader = () => {
  return(
    <div className="loader">
        <img src= {loader} alt="loader" />
    </div>
  );
};

export default Loader;
