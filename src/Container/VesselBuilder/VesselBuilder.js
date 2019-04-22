import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import Scene from "../Scene/Scene";
import SideModal from "../../Components/UI/SideModal/SideModal";
import Menu from "../Menu/Menu";
import FormDialog from "../FormDialog/FormDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import Dialog from "@material-ui/core/Dialog";

import { createMuiTheme } from "@material-ui/core/styles";

import Spinner from "../../Components/UI/Spinner/Spinner";
// import TreeView from "deni-react-treeview";
import TreeView from "../TreeView/TreeView";

// import TreeView from '../TreeView/TreeView';
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import SceneHorizontal from "../Scene/Scene_horizontal";
import html2canvas from "html2canvas";
import * as actions from '../../store/actions/index';

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
  state = {
    open: false
  };
  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push("/");
    }

   
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.error !== this.props.error) {
      this.setState({ open: true });
    }
    if(this.props.showSpinnerr && (prevProps.showSpinnerr !== this.props.showSpinnerr)){
      html2canvas(document.querySelector("#scene")).then(canvas => {
        console.log(canvas);
        // document.body.appendChild(canvas);
        window.open(canvas.toDataURL("image/png"));
        this.props.showSpinner(false);
      });
      
    }
  }

  handleClose = () => {
    this.setState({ open: false });
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

    let display = <div ><SideModal /></div>;
    if (this.props.componentTree) {
      // console.log(this.props.components);
      display = (
        <div  style={{ height: "100%" }}>
          <TreeView />
        </div>
      );
    }

    let scene = <Scene />;
    if (this.props.orientation === "vertical") {
      scene = (
        <div id="scene">
          <Scene />
        </div>
      );
    } else if (this.props.orientation === "horizontal") {
      scene = <div id="scene"><SceneHorizontal /></div>;
    }

    console.log(this.props.showSpinnerr);
    let spinner = null;
    if (this.props.showSpinnerr) {
      spinner = (
        <Dialog
          open={true}
          fullWidth={true}
          maxWidth="sm"
          aria-labelledby="simple-dialog-title"
        >
          <Spinner />
        </Dialog>
      );
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
<<<<<<< HEAD
        <div style={{ width: "50%" }}>{formDialog}</div>
        <ErrorDialog
          handleClose={this.handleClose}
          error={this.props.error}
          open={this.state.open}
        />
=======
        <div style={{width: "50%"}}>{formDialog}</div>
        
        <ErrorDialog handleClose = {this.handleClose} error={this.props.error} open={this.state.open}/>
>>>>>>> ea50e1afca5af12259926e4002b549f92547dbb7
        {spinner}
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
    orientation: state.componentData.orientation,
    error: state.componentData.error,
    showSpinnerr: state.componentData.showSpinner
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showSpinner: (value) => dispatch(actions.showSpinner(value))
  }}

// .propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(VesselBuilder));
