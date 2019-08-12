import React from "react";
import {Treebeard,decorators} from 'react-treebeard';
import classes from "./TreeViewComp.css";

const TreeViewComp = props => {
  const style= {
    tree: {
      base: {
        height: "100%",
        node: null,
        'background-color':"#ffffff",
        'font-family': "Times New Roman",
        'font-size':"18px",
        'border-style': 'solid',
        'border-width': '0px 0px 0.5px 0.5px'
      }
    }
  }

    const mydecorator =  {
      Header: (props) => {
        const activeColor =  '#000000';
        return (
          <div style={props.style.base}>
            <div id={props.node.id} style={{'color':activeColor}}>
              {props.node.name}
            </div>
          </div>
        );
      }
    }
  return (
    
    <div className={classes.tree}>
      <Treebeard
                style={style}
                data={props.data}
                onToggle={props.onToggle}
                decorators={{...decorators, Header: mydecorator.Header}}
            />
    </div>
  );
};

export default TreeViewComp;
