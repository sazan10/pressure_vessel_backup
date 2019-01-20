import React, { Component } from "react";
import Auth from './Container/Auth/Auth';
import {Route, Switch, withRouter, Redirect, HashRouter, Link} from "react-router-dom";
import classes from "./App.css";
import { connect } from "react-redux";
import DropDownMenu from "./Components/UI/DropDownMenu/DropDownMenu";
import Modal from "./Components/UI/Modal/Modal";
import CylinderParam1 from "./Components/CylinderParam1/CylinderParam1";
class App extends Component {
  render() {
    let show = "/";

    console.log(this.props.title);
    if (this.props.title === "Cylinder") {
      console.log("redirect");
      show = <Redirect to="/cylinderParam1" />;
    }

    return (
      <div className={classes.App}>
        <DropDownMenu />
        <Route path="/" component={Auth} />
        <Route path="/cylinderParam1" component={CylinderParam1} />
        {show}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: state.navigation.title,
    id: state.navigation.id,
    stateKey: state.navigation.stateKey
  };
};

export default connect(mapStateToProps)(App);
