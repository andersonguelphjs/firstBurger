import React, { Component } from "react";
import Aux from "../_Aux/_Aux";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
  state = {
    sideDrawerOpen: false,
  };
  sideDrawerClosedHandler = () => {
    this.setState({
      sideDrawerOpen: false,
    });
  };

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };
  render() {
    return (
      <Aux>
        <Toolbar menuClicked={this.sideDrawerToggleHandler} />
        <SideDrawer
          closed={this.sideDrawerClosedHandler}
          show={this.state.sideDrawerOpen}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
