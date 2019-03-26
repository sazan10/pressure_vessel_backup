import React, { Component } from "react";
import classes from "./Modal.css";
import {connect} from 'react-redux';
import Aux from "../../../hoc/Aux/Aux";
import DynamicForm from "../../Forms/Forms";
import * as actions from '../../../store/actions/index';
import Backdrop from '../Backdrop/Backdrop';
class Modal extends Component {

  shouldComponentUpdate ( nextProps, nextState ) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
}

  state = {
    current: {},
  };

  onSubmit = data => {
    this.props.onDataSend(data, this.props.projectID);
  };  

  render() {   
    // console.log(this.props.model + " Model"); 
    let modall = null;
    if(this.props.model) {
    modall = (
      <Aux>
        <Backdrop show={true} clicked={this.props.modalClosed} />
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
          onSubmit={data => {
            this.onSubmit(data);
      }}/>
        </div>
      </Aux>
    );
    }
    return (
      <div>
        {modall}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDataSend: (data, id) => dispatch(actions.onDataSend(data, id))
  };
};

export default connect( null, mapDispatchToProps)( Modal);
