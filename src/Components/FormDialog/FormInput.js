import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    display: 'block'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const FormDialog = (props) => {
  const { classes } = props;
  let element = null;
  switch (props.data.type) {
    case "text":
      element = <FormControl className={classes.formControl}>  <TextField autoFocus {...props.data} onChange={(event) => props.handleChange(event, 'projectName')} /></FormControl>;
      break;
    case "select":
      element =
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="orientation">Orientation</InputLabel>
          <Select
            native
            value={props.orientation}
            onChange={(event) => props.handleChange(event, 'orientation')}
            inputProps={{
              name: 'orientation',
              id: 'orientation',
            }}
          >
            <option value="" />
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </Select>
        </FormControl>
      break;
    default:
      break;
  }
  return element;
}

export default withStyles(styles)(FormDialog);