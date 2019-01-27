import React, { Component } from "react";
import classes from "./Modal.css";
import Aux from "../../../hoc/Aux/Aux";
import DynamicForm from "../../Forms/Forms";
import CylinderParam1 from '../../../JSONFiles/CylinderParam.json';
class Modal extends Component {
  state = {
    data: [
      {
        id: 1,
        name: "a",
        age: 29,
        qualification: "B.Com",
        rating: 3,
        gender: "male",
        city: "Kerala",
        skills: ["reactjs", "angular", "vuejs"]
      },
      {
        id: 2,
        name: "b",
        age: 35,
        qualification: "B.Sc",
        rating: 5,
        gender: "female",
        city: "Mumbai",
        skills: ["reactjs", "angular"]
      },
      {
        id: 3,
        name: "c",
        age: 42,
        qualification: "B.E",
        rating: 3,
        gender: "female",
        city: "Bangalore",
        skills: ["reactjs"]
      }
    ],
    current: {}
  };

  onSubmit = model => {
    console.log(model);
    let data = [];
    if (model.id) {
      data = this.state.data.filter(d => {
        return d.id !== model.id;
      });
    } else {
      model.id = +new Date();
      data = this.state.data.slice();
    }

    this.setState({
      data: [model, ...data]
    });
  };

  onEdit = id => {
    let record = this.state.data.find(d => {
      return d.id === id;
    });
    alert(JSON.stringify(record));
    this.setState({
      current: record
    });
  };

  render() {
    return (
      <Aux>
        {/* <Backdrop show={true} clicked={this.props.modalClosed} /> */}
        <div
          className={classes.Modal}
          style={{
            transform: true ? "translateY(0)" : "translateY(-100vh)",
            opacity: true ? "1" : "0"
          }}
        >
          <DynamicForm
            className="form"
            title="Registration"
            defaultValues={this.state.current}
            model={CylinderParam1}
            onSubmit={model => {
              this.onSubmit(model);
            }}
          />
        </div>
      </Aux>
    );
  }
}

export default Modal;
