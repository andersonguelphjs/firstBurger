import React from "react";
import classes from "./SideDrawer.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Aux from "../../../hoc/_Aux/_Aux";

const sideDrawer = (props) => {
  let sideDrawerClasses = [classes.SideDrawer, classes.Close];
  if (props.show) {
    sideDrawerClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Aux>
      <Backdrop clicked={props.closed} show={props.show} />
      <div className={sideDrawerClasses.join(" ")}>
        <div className={classes.Logo}>
          <Logo />
        </div>

        <nav>
          <NavigationItems />
        </nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;
