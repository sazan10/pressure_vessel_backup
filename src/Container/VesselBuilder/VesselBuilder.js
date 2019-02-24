import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import DropDownMenu from "../../Components/UI/DropDownMenu/DropDownMenu";
import Modal from "../../Components/UI/Modal/Modal";
import * as navbarData from "../../JSONFiles/File.json";
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import * as iconData from '../../JSONFiles/IconNavbar.json';
class VesselBuilder extends Component {
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

export default withRouter(VesselBuilder);
