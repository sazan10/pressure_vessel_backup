import React from "react";
import Button from "@material-ui/core/Button";
import classes from "./IconNavbar.css";

const IconNavbar = props => {
  let but = (
    <Button
      onClick={() => props.selectItem(props.title)}
      className={classes.Icons1}
    >
      {props.title}
      {/* <img src={a} alt="Fuck Pritesh" height="30px" width="30px"/> */}
    </Button>
  );
  if (
    (props.title === "Saddle" && props.orientation === "vertical") ||
    (props.title === "Skirt" && props.orientation === "horizontal")
  ) {
    but = null;
  }
  return (
    but
  )  ;
};

export default IconNavbar;
