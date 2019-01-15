import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Button from "../UI/Button/Button";
import classes from "./CylinderParam1.css";
import Select from "react-select";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

const inputVar = [
  { label: "Material", type: "dropdown", id: 1 },
  { label: "Internal Pressure", type: "number", id: 2 },
  { label: "External Pressure", type: "number", id: 3 },
  { label: "Height", type: "number", id: 4 },
  { label: "Internal Head", type: "checkbox", id: 5 },
  { label: "Corrosion Inner", type: "number", id: 6 },
  { label: "Corrosion Outer", type: "number", id: 7 }
];

class Parameter1 extends Component {
  state = {
    params: {
      material: "",
      ip: 0,
      temp1: 0,
      ep: 0,
      temp2: 0,
      ih: false,
      ic: 0,
      ec: 0
    },
    showNext: false
  };

  inputHandler = event => {
    // console.log(event);
    const updatedParams = {
      ...this.state.params
    };
    if (event.target.name === "ih") {
      const val = event.target.value;
      if (val === "on") {
        updatedParams[event.target.name] = true;
      } else {
        updatedParams[event.target.name] = false;
      }
    } else {
      updatedParams[event.target.name] = event.target.value;
    }
    this.setState({ params: updatedParams });
  };

  materialHandler = event => {
    console.log(event.value);
    const updatedParams = {
      ...this.state.params
    };
    updatedParams["material"] = event.value;
    // console.log(updatedParams);
    this.setState({ params: updatedParams });
  };

  render() {
    const opts = [
      { value: "SA-516 60", label: "SA-516 60" },
      { value: "SA-516 70", label: "SA-516 70" },
      { value: "SA-524 II Smis Pipe", label: "SA-524 II Smis Pipe" },
      { value: "SA-53 EA Wld Pipe", label: "SA-53 EA Wld Pipe" }
    ];

    let form = null;

    form = (
      <div>
        <form className={classes.body}>
          <div className={classes.Input}>
            <label className={classes.Label}>Material</label>
            <Select
              className={classes.Input2}
              options={opts}
              onChange={this.materialHandler}
            />
          </div>
          <div className={classes.Input1}>
            <div className={classes.Input}>
              <label className={classes.Label}>Internal Pressure</label>
              <input
                name="ip"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
            <div className={classes.Input}>
              <label className={classes.Label}>@</label>
              <input
                name="temp1"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
          </div>

          <div className={classes.Input1}>
            <div className={classes.Input}>
              <label className={classes.Label}>External Pressure</label>
              <input
                name="ep"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
            <div className={classes.Input}>
              <label className={classes.Label}>@</label>
              <input
                name="temp2"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
          </div>
          <div className={classes.Input1}>
            <label className={classes.Label1}>Corrosion</label>
          </div>
          <div className={classes.Input1}>
            <div className={classes.Input}>
              <label className={classes.Label}>Internal</label>
              <input
                name="ic"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
            <div className={classes.Input}>
              <label className={classes.Label}>External</label>
              <input
                name="ec"
                type="number"
                placeholder="0.0"
                className={classes.InputElement}
                onChange={this.inputHandler}
              />
            </div>
          </div>

          <div className={classes.Input1}>
            <div className={classes.Input}>
              <label className={classes.Label}>Internal Head</label>
              <input
                name="ih"
                type="checkbox"
                placeholder="0"
                className={classes.checkmark}
                onChange={this.inputHandler}
              />
            </div>
          </div>
        </form>
        <div>
          <Button
            btnType="Success"
            clicked={() => this.props.onSubmit(this.state.params)}
          >
            Next
          </Button>
          <Button btnType="Danger" clicked={this.props.cancelParams}>
            Cancel
          </Button>
        </div>
      </div>
    );

    return <Aux>{form}</Aux>;
  }
}

// const mapStateToProps = state => {
//   return {
//       title: state.navigation.title,
//       id: state.navigation.id,
//       stateKey: state.navigation.stateKey,

//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: data => dispatch(actions.cylinderParams1(data))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Parameter1);
