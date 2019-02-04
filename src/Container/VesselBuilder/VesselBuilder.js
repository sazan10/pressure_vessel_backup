import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import DropDownMenu from "../../Components/UI/DropDownMenu/DropDownMenu";
import Modal from "../../Components/UI/Modal/Modal";
import * as data from "../../JSONFiles/File.json";
class VesselBuilder extends Component {
  render() {
    const title = `Modal`;
    const menu = data.menu.map(d =>
      d[Object.keys(d)].map(dd => (
        <Route path={"/builder/" + dd.title} component={Modal} />
      ))
    );
    const RoutesMisc = (
      <div>
        <Route path={"/builder/cylinderParam2"} component={Modal} />
        <Route path={"/builder/ellipsoidalHeadParam2"} component={Modal} />
      </div>
    );
    return (
      <div>
        <DropDownMenu />
        <Switch>
          {menu}
          <Route path={"/builder/cylinderParam2"} component={Modal} />
          <Route path={"/builder/ellipsoidalHeadParam2"} component={Modal} /> 
        </Switch>
      </div>
    );
  }
}

export default withRouter(VesselBuilder);
