import React from "react";
import {Treebeard} from 'react-treebeard';
import classes from "./TreeViewComp.css";

const TreeViewComp = props => {
  const style= {
    tree: {
      base: {
        height: "100%",
        node: null
      }
    }
  }
  return (
    <div className={classes.tree}>
      <Treebeard
                style={style}
                data={props.data}
                onToggle={props.onToggle}
            />
    </div>
  );
};

export default TreeViewComp;
