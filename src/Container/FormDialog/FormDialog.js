import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import FormDialogComp from '../../Components/FormDialog/FormDialog';
import Spinner from '../../Components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
// import * as data from '../../JSONFiles/FormDialog/New';
import {
  connect
} from 'react-redux';
// import Test from '../../Components/Test/Test';
import List from '../../Components/List/List'; 
class FormDialog extends React.Component {
  state = {
    open: false,

    projectName: null,
    orientation: ""
  };

  componentDidMount() {
    // console.log(this.props.open);
    this.setState({ open: this.props.open })
    
    let newState = {
      ...this.state,
      ...this.props.formModel
    };
    if(this.props.title === "Open") {
      newState = {
        ...this.state,
        ...this.props.projects
      };
    }
    this.setState({newState});
    
  }                                                                                                                                                                     

  handleClose = () => {
    this.setState({ open: false });
    this.props.openFormDialog(false);
  };

  submit = (e) => {
    e.preventDefault();
    // console.log("Submit", this.state.orientation);
    
    this.props.requestProjectID(this.state.projectName, this.state.orientation);
    this.setState({ open: false });
    this.props.openFormDialog(false); 
  }

  handleChange = (event, name) => {
    // console.log(event.target.value, name);
    this.setState({ [name]: event.target.value });
  }

  handleClick = (event, id) => {
    console.log("Project ",id);
    this.setState({ open: false });
    this.props.openFormDialog(false);
    this.props.importSpecificProject(id); 
  }

  render() {
    let form = <FormDialogComp submit={this.submit} handleChange={this.handleChange} handleClose={this.handleClose} model={this.props.formModel} orientation={this.state.orientation}/>;
    if( this.props.title === "Open" && this.props.projects.length !== 0) {
      form = <List model={this.props.projects} handleClick={this.handleClick}></List> 
    } else if(this.props.title === "Open") {
      form = <Spinner/>
    }
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='sm'
          scroll='paper'
        > 
          {form}  
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      new: state.navigation.new,
      title: state.navigation.title,
      formModel: state.navigation.formModel,
      projects: state.navigation.projects

  };
};

const mapDispatchToProps = dispatch => {
  return {
      requestProjectID: (projectName, orientation) => dispatch(actions.requestProjectID(projectName, orientation)),
      openFormDialog: (value) => dispatch(actions.openFormDialog(value)),
      importSpecificProject: (name) => dispatch(actions.importSpecificProject(name))
      // importForm: (title) => dispatch(actions.importForm(title))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);