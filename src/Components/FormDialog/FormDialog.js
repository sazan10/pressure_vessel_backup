import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormInput from "./FormInput/FormInput";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  root: {
    display: "block",
    flexWrap: "wrap"
  }
});

const FormDialog = props => {
  const { classes } = props;
  // console.log("Form Dialog", props.model);
  const formElementsArray = [];
  if (props.model !== undefined && props.model !== null) {
    for (let key in props.model) {
      formElementsArray.push({
        id: key,
        config: props.model[key]
      });
    }
  }

  let form = formElementsArray.map(formElement => (
    <FormInput
      key={formElement.id}
      data={formElement.config}
      handleChange={props.handleChange}
      orientation={props.orientation}
    />
  ));

  let submitButton = (
    <Button disabled type="submit" color="primary">
      Create
    </Button>
  );
  if(!props.disabled) {
    submitButton = <Button type="submit" color="primary">
      Create
    </Button>
  }
  return (
    <div>
      <DialogTitle id="form-dialog-title">New Project</DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off" onSubmit={props.submit}>
          <div className={classes.root}>{form}</div>
          <DialogActions>
            <Button onClick={props.handleClose} color="primary">
              Cancel
            </Button>
            {submitButton}
          </DialogActions>
        </form>
      </DialogContent>
    </div>
  );
};

export default withStyles(styles)(FormDialog);
