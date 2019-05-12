import React from "react";
import Input from "../../../Container/Auth/Input/Input";
import {withStyles} from '@material-ui/core/styles';

const styles = {
    Label:{
        display: 'block',
        /* margin-bottom: 8px; */
        fontSize: 'small'
    }

}
const FormBuild = props => {
  const {classes} = props;
  const formElementsArray = [];
  for (let key in props.form) {
    if (key === "componentID") continue;
    formElementsArray.push({
      id: key,
      config: props.form[key]
    });
  }

  let form = formElementsArray.map(formElement => (
    <tr key={formElement.id}>
      <td style={{ width: "60%" }}>
        <label style={{ margin: 0 }} className={classes.Label}>
          {formElement.config.label}
        </label>
      </td>
      <td>
        <Input
          style={{ padding: 0 }}
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation.required}
          touched={formElement.config.touched}
          changed={event => props.inputChangedHandler(event, formElement.id)}
        />
      </td>
    </tr>
  ));
  return (
    <table>
      <tbody>{form}</tbody>
    </table>
  );
};

export default withStyles(styles)(FormBuild);
