import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as actions from '../../store/actions/index';
import {
  connect
} from 'react-redux';

class FormDialog extends React.Component {
  state = {
    open: false,

    projectName: null

  };

  componentDidMount() {
    console.log(this.props.open);
    this.setState({ open: this.props.open })
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.openFormDialog(false);
  };

  submit = (e) => {
    e.preventDefault();
    this.props.requestProjectID(this.state.projectName);
    this.setState({ open: false });
    this.props.openFormDialog(false);
    
  }

  handleChange = (event, name) => {
    console.log(event.target.value);
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Project</DialogTitle>
          <DialogContent>
            <form noValidate autoComplete="off" onSubmit={this.submit}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Project Name"
                type="text"
                onChange={(event) => this.handleChange(event, 'projectName')}

              />
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
            </Button>
                <Button type="submit" color="primary">
                  Create
            </Button>
              </DialogActions>
            </form>
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      new: state.navigation.new
  };
};

const mapDispatchToProps = dispatch => {
  return {
      requestProjectID: (projectName) => dispatch(actions.requestProjectID(projectName)),
      openFormDialog: (value) => dispatch(actions.openFormDialog(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog);