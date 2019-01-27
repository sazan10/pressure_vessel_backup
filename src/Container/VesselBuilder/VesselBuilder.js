import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import DropDownMenu from "../../Components/UI/DropDownMenu/DropDownMenu";
import Modal from "../../Components/UI/Modal/Modal";
import * as data from "../../JSONFiles/File.json";
import CylinderParam1 from '../../Components/CylinderParam1/CylinderParam1';
class VesselBuilder extends Component {
  
  render() {
    const title = `Modal`;
    const menu = data.menu.map(d =>
      d[Object.keys(d)].map(dd => (
        <Route path={"/builder/" + dd.title} component={Modal} />
      ))
    );
    return (
      <div>
        <DropDownMenu />
        <Switch>{menu}</Switch>
        
      </div>
    );
  }
}

export default withRouter(VesselBuilder);
