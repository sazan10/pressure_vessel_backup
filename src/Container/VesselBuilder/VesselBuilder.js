import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';

import { Switch, Route, withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import Scene from '../Scene/Scene';
import { Redirect } from 'react-router-dom';
import SideModal from '../../Components/UI/SideModal/SideModal';
import Menu from '../Menu/Menu';
class VesselBuilder extends Component {

  componentDidMount() {
    console.log("ComponentDidMount");
    console.log(this.props.isAuthenticated);
    if (!this.props.isAuthenticated) {
      this.props.history.push("/");
    }
  }
  render() {
    // const menu = navbarData.menu.map(d =>
    //   d[Object.keys(d)].map(dd => (
    //     <Route path={"/builder/" + dd.title} component={SideModal} />
    //   ))
    // );
    // const iconMenu = iconData.default.Icons.map(d => 
    //   <Route path={"/builder/hello"} component={Modal} />
    // );
    let scene = null;
    if(this.props.projectID !== null) {
      scene = <Scene></Scene>;
    }

    return (
      <div>
        <Grid container spacing={0}>
          <Grid item lg={12} sm={12} xs={4}>
            <Menu />
          </Grid>
        </Grid>

        <Grid container spacing={0}>
          <Grid item lg={2} md={2} sm={3} xs={4}>
            <SideModal />
          </Grid>
          <Grid item lg={10} md={10} sm={9} xs={8}>
            <Scene></Scene>
          </Grid>
        </Grid>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    projectID: state.componentData.projectID
  };
};

// .propTypes = {
//   classes: PropTypes.object.isRequired,
// };


export default connect(mapStateToProps, null)(withRouter(VesselBuilder));
