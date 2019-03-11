import React, { Component } from "react";
import classes from "./SideModal.css";
import {connect} from 'react-redux';
import Aux from "../../../hoc/Aux/Aux";
import DynamicForm from "../../Forms/Forms";
import * as actions from '../../../store/actions/index';
class Modal extends Component {

  componentWillReceiveProps() {
    // console.log("COmponntDIdUpdate" + this.state.component);
  }

  state = {
    current: {},
  };

  render() {   
    let modall = null;
    if(this.props.model) {
    modall = (
      <Aux>
        <DynamicForm
          className="form"
          title="Registration"
          defaultValues={this.state.current}
          model={this.props.model}
      />
      </Aux>
    );
    }
    return (
      <div className={classes.Modal}>
        {modall}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      title: state.navigation.title,
      model: state.navigation.model,
      num: state.navigation.num,
      projectID: state.componentData.projectID
  };
};

export default connect( mapStateToProps, null)( Modal);
