import React from "react";
import classes from "./SideModal.css";
import Auxx from "../../../hoc/Auxx/Auxx";
import DynamicForm from "../../Forms/Forms";

const  Modal = (props) =>  {

    let modall = null;
    // const projectTitle = props.projectName;
    if(props.model) {
    modall = (
      <Auxx>
        <p>Component Type: {props.title}</p>
        <DynamicForm
          className="form"
          title="Registration"
          model={props.model}
          msg=""
      />
      </Auxx>
    );
    }
    else if (props.projectID)
    modall=(
      <p className={classes.info}> CLICK ON "COMPONENT" TO START ADDING COMPONENTS</p>
    )
    else 
    {
      modall=(
        <p className={classes.info}> WELCOME TO VESSEL EXPRESS <br></br><br></br>CLICK ON "NEW" TO START NEW PROJECT</p>
      )
    }
    return (
      <div className={classes.Modal}>
        {modall}
      </div>
    );
  }


export default ( Modal);
