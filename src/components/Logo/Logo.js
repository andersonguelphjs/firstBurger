import React from "react";
import classes from "./Logo.module.css";
import burgerLogo from "../../assets/img/burger-logo.png";

const logo = (props) => (
  <div className={classes.Logo}>
    <img src={burgerLogo} alt="myBoogoo" />
  </div>
);

export default logo;
