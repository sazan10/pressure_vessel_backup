import React from "react";
import PermIdentity from '@material-ui/icons/PermIdentity';
const Username = props => {
  return (
    <div
      style={{ right: "10px", display: "inline-flex", position: "absolute" }}
    >
    <PermIdentity />
      {props.username}
    </div>
  );
};

export default Username;
