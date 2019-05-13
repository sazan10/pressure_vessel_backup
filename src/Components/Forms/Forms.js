import React from "react";
// import ReactDOM from 'react-dom';
import { withRouter } from "react-router-dom";
import * as actions from "../../store/actions/index";
import classes from "./Forms.css";
import { connect } from "react-redux";
import Button from "../UI/Button/Button";
import PropTypes from "prop-types";

import FormBuild from './FormBuild/FormBuild'
import * as functions from '../../Functions/functions';

class DynamicForm extends React.Component {

  state = {
    form: {},
    data: {},
    passMatch: false,
    valid: true,
    message: ""
  };

  updateStateModel = model => {
    console.log(model);
    this.setState({form: model},
      () => {
        //show the component parameters for clicked component
        if(this.props.componentClick){this.updateComponentByID()};
      }
    );
  };

  componentDidMount() {
      this.updateStateModel(functions.checkLLAndHorizontal(this.props.title, this.props.orientation, this.props.model));
  }

  checkForOrientationForHead = (isComponentClicked) => {
    return functions.checkForHeadOrientation(this.props.title, this.props.orientation,this.props.model);
  }

  //to copy from the last relatable component in the new form
  copyFromLast = e => {
    e.preventDefault();
    const name = this.props.title.toLowerCase().replace(" ", "");
    const data = this.props[name];
    this.setState({
      form: functions.copyFromLast(this.state.form, data)
    });
  };

  //to show the value of a specific component in the sidebar by means of ID
  updateComponentByID = () => {
    this.setState({
      form: functions.updateComponentWithNewValues(this.state.form, this.props.componentByID)
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
    if(prevProps.title!==this.props.title)
    {
      this.setState({message:""});
    }
    // console.log(this.props.componentByID);
    //to check if new type of component is to be added or the same type of component is needed to be added again
    //and update the componentID automatically
    let updatedModel = this.props.model;
    const modelChanged = prevProps.model !== this.props.model? true: false
    if (modelChanged || this.props.new){
      
      if(modelChanged) {
        updatedModel= this.checkForOrientationForHead(false);
      
      }
      this.props.disableNew();
      updatedModel.componentID.placeholder = this.props.componentID;
      updatedModel.componentID.value = this.props.componentID;

      if(this.props.model.thickness !== undefined && this.props.model.thickness !== null) {
        try {
          console.log("changing values");
          updatedModel = functions.updateComponentValues(updatedModel, this.props.ip, this.props.temp1, this.props.sd, this.props.thickness);
       
        } catch {
          console.log("P or T or SD or TH update failed");
        }
      }
      this.updateStateModel(functions.checkLLAndHorizontal(this.props.title, this.props.orientation, updatedModel));
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
      return functions.checkValidity(value, rules);
    }

  //dont change the component ID manually
  inputChangedHandler = (event, controlName) => {
  if (controlName !== "componentID") {
      let validity=true;
      if(controlName==="length" && ((event.target.value<0) || (event.target.value>15)) && (this.props.title==="Cylinder" || this.props.title==="Conical")) {
          validity=false;
          this.setState({ message: "Length should be less than 15"});
        }
        else {
          validity= this.checkValidity(
            event.target.value,
            this.state.form[controlName].validation
          )
          this.setState({ message: ""});
        }
      const updatedForm = {
        ...this.state.form,
        [controlName]: {
          ...this.state.form[controlName],
          value: event.target.value,
          valid:validity,
          touched: true
        }
      };
      this.setState({
        form: updatedForm
      });
    }
  };

  render() {
  
    // console.log(this.props.model);

    return (
      <div>
        <form onSubmit={this.onSubmitHandler}>
        <FormBuild form={this.state.form} inputChangedHandler={this.inputChangedHandler}/>
          <div style={{color:"red"}}>
          {this.state.message }
          </div>

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
    projectID: state.projectData.projectID,
    error: state.componentData.error,
    componentID: state.componentData.componentID,
    new: state.navigation.new,
    cylinder: state.components.cylinder,
    ellipsoidalhead: state.components.ellipsoidalhead,
    nozzle: state.components.nozzle,
    skirt: state.components.skirt,
    saddle: state.components.saddle,
    conical: state.components.conical,
    componentByID: state.components.componentByID,
    componentClick: state.flags.componentClicked,
    orientation: state.projectData.orientation,
    ip: state.componentData.pressure,
    temp1: state.componentData.temperature,
    sd: state.componentData.shellDiameter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    importModel: (title, num) => dispatch(actions.importComponentModel(title, num)),
    disableNew: () => dispatch(actions.disableNew()),
    onSubmitAndUpdate: (data, id, componentID) =>
      dispatch(actions.onSubmitAndUpdate(data, id, componentID)),
    deleteThickness: () => dispatch(actions.deleteThickness()),
    displayComponentTree: value =>
      dispatch(actions.displayComponentTree(value)),
    componentClicked: value => dispatch(actions.componentClicked(value)),
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