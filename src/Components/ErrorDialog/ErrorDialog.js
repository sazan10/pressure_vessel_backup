import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ErrorDialog = (props) => {

    let error = null;
    if(props.error !== null) {
        if(props.error.data !== null) {
        error = JSON.stringify(props.error.data)
        // console.log(props.error);
        // error = props.error;
        }
    }
    // console.log(error);
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error}
            </DialogContentText>
          </DialogContent>
          
        </Dialog>
      </div>
    );
  
}

export default ErrorDialog;