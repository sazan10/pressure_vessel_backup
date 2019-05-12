import React from "react";
import Button from "@material-ui/core/Button";
import classes from "./IconNavbar.css";

const IconNavbar = props => {
  let but = (
    <Button
      onClick={() => props.selectItem(props.title)}
      className={classes.IconsI} 
      color='inherit'
    >
      {props.title}
      {/* <img src={a} alt="Pritesh" height="30px" width="30px"/> */}
    </Button>
  );

  //allow saddle in horizontal and skirt in vertical orientation only
  if (
    (props.title === "Saddle" && props.orientation === "vertical") ||
    (props.title === "Skirt" && props.orientation === "horizontal")
  ) {
    but = null;
  }
  return (
    <div style={{'backgroundColor':'#dddddd','display':'inline-flex'}}>
      {but}
    </div>
  )  ;
};

export default IconNavbar;
