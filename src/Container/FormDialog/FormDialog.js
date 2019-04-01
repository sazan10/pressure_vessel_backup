import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import FormDialogComp from '../../Components/FormDialog/FormDialog';

import * as actions from '../../store/actions/index';
import * as data from '../../JSONFiles/FormDialog/New';
import {
  connect
} from 'react-redux';
import List from '../../Components/List/List'; 
class FormDialog extends React.Component {
  state = {
    open: false,

    projectName: null

  };

  componentDidMount() {
    console.log(this.props.open);
    this.setState({ open: this.props.open })
    let newState = {
      ...this.state,
      ...data
    };
    this.setState({newState});
    
  }                                                                                                                                                                     

  handleClose = () => {
    this.setState({ open: false });
    this.props.openFormDialog(false);
  };

  submit = (e) => {
    e.preventDefault();
    console.log("Submit");
    this.props.requestProjectID(this.state.projectName);
    this.setState({ open: false });
    this.props.openFormDialog(false); 
  }

  handleChange = (event, name) => {
    console.log(event.target.value);
    this.setState({ [name]: event.target.value });
  }

  handleClick = (event, name) => {
    console.log("Project",name);
    this.setState({ open: false });
    this.props.openFormDialog(false); 
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        > 
          {/* <List model={data} handleClick={this.handleClick}></List> */}
          <FormDialogComp submit={this.submit} handleChange={this.handleChange} handleClose={this.handleClose} model={data}/>

        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      new: state.navigation.new,
      title: state.navigation.title

  };
};

const mapDispatchToProps = dispatch => {
  return {
      requestProjectID: (projectName) => dispatch(actions.requestProjectID(projectName)),
      openFormDialog: (value) => dispatch(actions.openFormDialog(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);