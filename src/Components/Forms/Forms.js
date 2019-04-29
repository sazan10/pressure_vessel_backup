import React from "react";
// import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import * as actions from "../../store/actions/index";
import classes from "./Forms.css";
import { connect } from "react-redux";
import Input from "../../Container/Auth/Input/Input";
import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

const initialState = {
  form: {},
  data: {},
  passMatch: false,
  valid: true,
  message: ""
};

const liftingLugAddition = {
  elementType: "input",
  elementConfig: {
    type: "input"
  },
  validation: {
    required: true
  },
  placeholder: "0",
  value: "10",
  label: "Distance from CG",
  valid: true
};
class DynamicForm extends React.Component {
  constructor() {
    // console.log("Form Refreshed");
    super();
    this.state = initialState;
  }

  state = {
    form: {},
    data: {},
    passMatch: false,
    valid: true,
    message: ""
  };

  updateStateModel = model => {
    console.log(model);
    this.setState(
      {
        form: model
      },
      () => {
        //show the component parameters for clicked component
        this.updateComponentByID();
      }
    );
  };

  componentDidMount() {
    if (!this.props.componentClick) {
      if (
        this.props.title === "Lifting Lug" &&
        this.props.orientation === "horizontal"
      ) {
        const updatedModel = this.props.model;
        updatedModel["distance"] = liftingLugAddition;
        this.setState({ form: updatedModel });
      } else {
        this.setState({ form: this.props.model });
      }
      // this.checkForOrientationForHead(false);
    } else {
      if (
        this.props.title === "Lifting Lug" &&
        this.props.orientation === "horizontal"
      ) {
        const updatedModel = this.props.model;
        updatedModel["distance"] = liftingLugAddition;
        this.updateStateModel(updatedModel);
      } else {
        this.updateStateModel(this.props.model);
      }
      // this.checkForOrientationForHead(true);
    }
    
  }

  checkForOrientationForHead = (isComponentClicked) => {
    if (
      this.props.title === "Ellipsoidal Head" &&
      this.props.orientation === "horizontal"
    ) {
      console.log(this.props.model);
      const updatedModel = this.props.model;
      updatedModel.position.elementConfig.options = [
        {
          displayValue: "left",
          value: "0"
        },
        {
          displayValue: "right",
          value: "1"
        }
      ];
      if(isComponentClicked) {
        this.updateStateModel(updatedModel);
        
      } else {
        this.setState({ form: updatedModel});
      }
    }
  }

  //to copy from the last relatable component in the new form
  copyFromLast = e => {
    e.preventDefault();
    // console.log("Button Clicked");
    let data = null;
    const name = this.props.title.toLowerCase().replace(" ", "");
    data = this.props[name];
    // console.log(name, data);
    const updatedForm = {
      ...this.state.form
    };
    // console.log(updatedForm);
    // console.log(data);
    for (let key in data) {
      console.log(key, updatedForm[key], data[key]);
      if (key !== "componentID") {
        if (updatedForm[key] !== undefined) {
          updatedForm[key] = {
            ...updatedForm[key],
            value: data[key]
            // valid: this.checkValidity(data[key], updatedForm[key].validation),
          };
        }
      }
    }
    this.setState({
      form: updatedForm
    });
  };

  //to show the value of a specific component in the sidebar by means of ID
  updateComponentByID = () => {
    let data = null;
    // console.log(this.props.componentByID);
    data = this.props.componentByID;
    const updatedForm = {
      ...this.state.form
    };
    // console.log(updatedForm);
    // console.log(data);
    for (let key in data) {
      // console.log(key, updatedForm[key], data[key]);
      if (updatedForm[key] !== undefined) {
        updatedForm[key] = {
          ...updatedForm[key],
          value: data[key]
          // valid: this.checkValidity(data[key], updatedForm[key].validation),
        };
      }
    }
    this.setState({
      form: updatedForm
    });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    //after submitted the value whether a component was clicked in Scene is returned to false
    this.props.componentClicked(false);
    let data = {
      component: this.props.title,
      type: "blob"
    };
    for (let key in this.state.form) {
      data = {
        ...data,
        [key]: this.state.form[key].value
      };
    }
    console.log("OnSubmit", data);

    let valid = this.state.valid;
    for (let key in this.state.form) {
      valid = valid & this.state.form[key].valid;
    }
    // console.log(data);
    if (valid) {
      //push data to the server.
      //projectID is sent to identify the project to which the component should be added
      //componentID is sent to check whether new component is added or old component is edited
      this.props.onSubmitAndUpdate(
        data,
        this.props.projectID,
        this.props.componentID
      );
      this.setState({ message: null });
    } else {
      this.setState({ message: <p>Data not valid</p> });
    }

    //after submitting the component data, the tree is displayed
    this.props.displayComponentTree(true);

    this.props.history.push("/builder");
  };

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props.componentByID);
    //to check if new type of component is to be added or the same type of component is needed to be added again
    //and update the componentID automatically
    if (
      (prevProps.model !== this.props.model || this.props.new) &&
      !this.props.componentClick
    ) {
      console.log(this.props.model);
      if(prevProps.model !== this.props.model ) {
      this.checkForOrientationForHead(false);
      }
      this.props.disableNew();
      this.props.model.componentID.placeholder = this.props.componentID;
      this.props.model.componentID.value = this.props.componentID;

      if(this.props.thickness !== null && this.props.thickness !== undefined) {
        try {
          this.props.model.ip.placeholder = this.props.model.ip.value =this.props.ip;
          this.props.model.temp1.placeholder = this.props.model.temp1.value =this.props.temp1;
          this.props.model.sd.placeholder = this.props.model.sd.value =this.props.sd;
          this.props.model.thickness.placeholder = this.props.model.thickness.value = this.props.thickness;
       
        } catch {
          console.log("P or T or SD or TH update failed");
        }
      }
      if (
        this.props.title === "Lifting Lug" &&
        this.props.orientation === "horizontal"
      ) {
        const updatedModel = this.props.model;
        updatedModel["distance"] = liftingLugAddition;
        this.setState({ form: updatedModel });
      } else {
        this.setState({ form: this.props.model });
      }
    }

    if (this.props.componentClick && prevProps.model !== this.props.model) {
      if (
        this.props.title === "Lifting Lug" &&
        this.props.orientation === "horizontal"
      ) {
        const updatedModel = this.props.model;
        updatedModel["distance"] = liftingLugAddition;
        this.updateStateModel(updatedModel);
      } else {
        this.updateStateModel(this.props.model);
      }
      this.checkForOrientationForHead(true);
      console.log(" inside component click");
    }

    //to update the new calculated thickness in the form
    if (this.props.thickness !== null && this.state.form === this.props.model) {
      if (this.state.form.thickness !== undefined) {
        let updatedform = {
          ...this.state.form
        };
        updatedform.thickness.value = this.props.thickness;
        updatedform.thickness.placeholder = this.props.thickness;
        // console.log(updatedform);
        this.setState({ form: updatedform });
        // this.props.deleteThickness();
      }
    }

    if (prevProps.componentByID !== this.props.componentByID) {
      this.updateComponentByID();
    }
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  }

  //dont change the component ID manually
  inputChangedHandler = (event, controlName) => {
    // console.log(event, controlName);
    if (controlName !== "componentID") {
      const updatedForm = {
        ...this.state.form,
        [controlName]: {
          ...this.state.form[controlName],
          value: event.target.value,
          valid: this.checkValidity(
            event.target.value,
            this.state.form[controlName].validation
          ),
          touched: true
        }
      };
      this.setState({
        form: updatedForm
      });
    }
  };

  renderForm = () => {
    // console.log(this.state.form);
    const formElementsArray = [];
    for (let key in this.state.form) {
      if(key === "componentID")
        continue;
      formElementsArray.push({
        id: key,
        config: this.state.form[key]
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
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={event => this.inputChangedHandler(event, formElement.id)}
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

  render() {
    // console.log(this.props.model);

    return (
      <div>
        <form onSubmit={this.onSubmitHandler}>
          {this.renderForm()}
          {this.state.message}

          <Button
            color="primary"
            type="submit"
            btnType="Success"
            disabled="true"
          >
            SUBMIT
          </Button>
        </form>
        <Button
          color="primary"
          btnType="Success"
          clicked={e => this.copyFromLast(e)}
        >
          Copy From Last
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: state.navigation.title,
    model: state.navigation.componentModel,
    num: state.navigation.num,
    thickness: state.componentData.thickness,
    projectID: state.componentData.projectID,
    error: state.componentData.error,
    componentID: state.componentData.componentID,
    new: state.navigation.new,
    cylinder: state.componentData.cylinder,
    ellipsoidalhead: state.componentData.ellipsoidalhead,
    nozzle: state.componentData.nozzle,
    skirt: state.componentData.skirt,
    saddle: state.componentData.saddle,
    conical: state.componentData.conical,
    componentByID: state.componentData.componentByID,
    componentClick: state.componentData.componentClicked,
    orientation: state.componentData.orientation,
    ip: state.componentData.pressure,
    temp1: state.componentData.temperature,
    sd: state.componentData.shellDiameter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    importModel: (title, num) => dispatch(actions.importModel(title, num)),
    disableNew: () => dispatch(actions.disableNew()),
    onSubmitAndUpdate: (data, id, componentID) =>
      dispatch(actions.onSubmitAndUpdate(data, id, componentID)),
    deleteThickness: () => dispatch(actions.deleteThickness()),
    displayComponentTree: value =>
      dispatch(actions.displayComponentTree(value)),
    componentClicked: value => dispatch(actions.componentClicked(value))
  };
};

DynamicForm.propTypes = {
  title: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  thickness: PropTypes.number,
  projectID: PropTypes.number,
  componentID: PropTypes.number.isRequired,
  componentClick: PropTypes.bool,
  componentByID: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DynamicForm));
