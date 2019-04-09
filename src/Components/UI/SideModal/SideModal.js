import React, { Component } from "react";
import classes from "./SideModal.css";
import {connect} from 'react-redux';
import Auxx from "../../../hoc/Auxx/Auxx";
import DynamicForm from "../../Forms/Forms";
class Modal extends Component {

  componentWillReceiveProps() {
    // console.log("COmponntDIdUpdate" + this.state.component);
  }

  state = {
    current: {},
  };

  render() {   
    let modall = null;
    const projectTitle = this.props.projectName;
    if(this.props.model) {
    modall = (
      <Auxx>
        <p>Project Name: {projectTitle}</p>
        <DynamicForm
          className="form"
          title="Registration"
          defaultValues={this.state.current}
          model={this.props.model}
      />
      </Auxx>
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
      model: state.navigation.componentModel,
      num: state.navigation.num,
      projectID: state.componentData.projectID,
      projectName: state.componentData.projectName,
  };
};

export default connect( mapStateToProps, null)( Modal);
