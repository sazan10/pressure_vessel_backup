import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import DropDownMenu from "../../Components/UI/DropDownMenu/DropDownMenu";
import Modal from "../../Components/UI/Modal/Modal";
import * as navbarData from "../../JSONFiles/File.json";
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import * as iconData from '../../JSONFiles/IconNavbar.json';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
class VesselBuilder extends Component {

  componentDidMount() {
    console.log("ComponentDidMount");
    console.log(this.props.isAuthenticated);
      if(!this.props.isAuthenticated) {
        this.props.history.push("/");
      } 
  }
  render() {
    const menu = navbarData.menu.map(d =>
      d[Object.keys(d)].map(dd => (
        <Route path={"/builder/" + dd.title} component={Modal} />
      ))
    );
    // const iconMenu = iconData.default.Icons.map(d => 
    //   <Route path={"/builder/hello"} component={Modal} />
    // );

    return (
      <div>
        <DropDownMenu />
        <IconNavbar/>
        <Switch>
          {menu}
          {/* {iconMenu} */}
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default connect(mapStateToProps, null) (withRouter(VesselBuilder));
