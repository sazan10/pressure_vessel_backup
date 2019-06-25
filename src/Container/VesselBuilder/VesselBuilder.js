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
import Support from "../../Components/UI/Support/Support";
import SupportModal from "../../Components/UI/Support/SupportModal";
// import { createMuiTheme } from "@material-ui/core/styles";

import Spinner from "../../Components/UI/Spinner/Spinner";
// import TreeView from "deni-react-treeview";
import TreeView from "../TreeView/TreeView";
// import TreeView from '../TreeView/TreeView';
// import blue from "@material-ui/core/colors/blue";
// import pink from "@material-ui/core/colors/pink";
import SceneHorizontal from "../Scene/Scene_horizontal";
// import html2canvas from "html2canvas";
import * as actions from '../../store/actions/index';

// const theme = createMuiTheme({
//   typography: {
//     useNextVariants: true,
//   },
//   palette: {
//     primary: blue,
//     secondary: {
//       light: "#ff79b0",
//       main: pink.A200,
//       dark: "#c60055",
//       contrastText: "#fff"
//     }
//   }
// });

export class VesselBuilder extends Component {
  state = {
    open: false,
    showSupport:false,
    mail:{

    }
  };
  componentDidMount() {
    if (!this.props.isAuthenticated) {
      // this.props.history.push("/");
    }

   
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.error !== this.props.error) {
      this.setState({ open: true });
    }
    // if(this.props.showSpinnerr && (prevProps.showSpinnerr !== this.props.showSpinnerr)){
    //   html2canvas(document.querySelector("#scene")).then(canvas => {
    //     console.log(canvas);
    //     // document.body.appendChild(canvas);
    //     window.open(canvas.toDataURL("image/png"));
    //     this.props.showSpinner(false);
    //   });
      
    // }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  showSupportComponent=()=>{
    this.setState({showSupport:true})
  }

  dropModal=()=>{
    this.setState({showSupport:false})
  }
  uploadAttachment=(e)=>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload=(e)=>{
      ;
    }
  }

  onSubmitTicket=(data)=>{
  //   axios.post('/ticketing/', data)
  // .then( res => {
  //     this.setState({ sent: true }, this.resetForm())
  // })
  // .catch( () => {
  //   console.log('Message not sent')
  //   alert("Message send failed. Check internet connection!")
  //   this.resetForm2();
  // })
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

    let formDialog = null;
    if (this.props.formDialogOpen) {
      formDialog = <FormDialog open={this.props.formDialogOpen} />;
    }

    let display = <div ><SideModal projectID={this.props.projectID} model={this.props.model} title={this.props.title}/></div>;
    if (this.props.componentTree) {
      // console.log(this.props.components);
      display = (
        <div  style={{ height: "100%" }}>
          <TreeView />
        </div>
      );
    }

    // let scene = <Scene />;
    let scene = null;
    if (this.props.orientation === "vertical") {
      scene = (
        <div id="scene">
          <Scene />
        </div>
      );
    } else if (this.props.orientation === "horizontal") {
        scene = <div id="scene"><SceneHorizontal /></div>;
    }
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
    let showSupport1=null;
    if(this.state.showSupport)
    {
      showSupport1=(   <SupportModal show={true} backDropOff={this.dropModal}>
        <Support onSubmitTicket={this.onSubmitTicket} uploadAttachment={this.uploadAttachments}></Support>
        </SupportModal>);
    }

    return (
      <div>
        <Grid container spacing={0}>
          <Grid item lg={12} sm={12} xs={4}>
          <Menu showSupport={this.showSupportComponent}/>
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
        <div style={{ width: "50%" }}>{formDialog}</div>
        <ErrorDialog
          handleClose={this.handleClose}
          error={this.props.error}
          open={this.state.open}
        />
        {showSupport1}

        {spinner}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    projectID: state.projectData.projectID,
    title: state.navigation.title,
    formDialogOpen: state.flags.formDialogOpen,
    components: state.componentData.component,
    componentTree: state.navigation.componentTree,
    orientation: state.projectData.orientation,
    error: state.componentData.error,
    showSpinnerr: state.flags.showSpinner,
    model: state.navigation.componentModel
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