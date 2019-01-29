import React, { Component } from "react";
import classes from "./Modal.css";
import {connect} from 'react-redux';
import Aux from "../../../hoc/Aux/Aux";
import DynamicForm from "../../Forms/Forms";
import * as actions from '../../../store/actions/index';
class Modal extends Component {

  componentWillReceiveProps() {
    console.log("COmponntDIdUpdate" + this.state.component);
  }

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
    current: {},
    component: null, 
    change: false
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
    console.log(this.props.model + " Model"); 
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
          model={this.props.model}
          onSubmit={model => {
            this.onSubmit(model);
      }}/>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
      title: state.navigation.title,
      model: state.navigation.model
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//       onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
//       onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
//   };
// };

export default connect( mapStateToProps)( Modal);
