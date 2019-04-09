import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import Scene from "../Scene/Scene";
import SideModal from "../../Components/UI/SideModal/SideModal";
import Menu from "../Menu/Menu";
import FormDialog from "../FormDialog/FormDialog";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// import TreeView from "deni-react-treeview";
import TreeView from "../TreeView/TreeView";

// import TreeView from '../TreeView/TreeView';
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import SceneHorizontal from "../Scene/Scene_horizontal";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: "#ff79b0",
      main: pink.A200,
      dark: "#c60055",
      contrastText: "#fff"
    }
  }
});

class VesselBuilder extends Component {
  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  handleSelect = name => {
    console.log("item selected", name.text);
  };

  render() {
    // const menu = navbarData.menu.map(d =>
    //   d[Object.keys(d)].map(dd => (
    //     <Route path={"/builder/" + dd.title} component={SideModal} />
    //   ))
    // );
    // const iconMenu = iconData.default.Icons.map(d =>
    //   <Route path={"/builder/hello"} component={Modal} />
    // );

    let formDialog = null;
    if (this.props.formDialogOpen) {
      formDialog = <FormDialog open={this.props.formDialogOpen} />;
    }

    let display = <SideModal />;
    if (this.props.componentTree) {
      console.log(this.props.components);
      display = (
        <div style={{'height': '100%'}}>
          <TreeView />
        </div>
      );
    }

    let scene = <Scene />;
    if (this.props.orientation === "vertical") {
      scene = <Scene />;
    } else if (this.props.orientation === "horizontal") {
      scene = <SceneHorizontal />;
    }

    return (
      <div>
        <Grid container spacing={0}>
          <Grid item lg={12} sm={12} xs={4}>
            <Menu />
          </Grid>
        </Grid>

        <Grid container spacing={0}>
          <Grid item lg={3} md={3} sm={3} xs={4}>
            {display}
          </Grid>
          <Grid item lg={9} md={9} sm={9} xs={8}>
            {scene}
          </Grid>
        </Grid>
        {formDialog}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    projectID: state.componentData.projectID,
    formDialogOpen: state.componentData.formDialogOpen,
    components: state.componentData.component,
    componentTree: state.navigation.componentTree,
    orientation: state.componentData.orientation
  };
};

// .propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default connect(
  mapStateToProps,
  null
)(withRouter(VesselBuilder));
