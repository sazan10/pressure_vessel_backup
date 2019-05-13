import React from 'react';
import classes from './Menu.css';

const Menu = (props) => {

      return props.titleHead?<div style={{'backgroundColor': props.color}} className={classes.Menu} onClick={() => props.selectItem(props.titleHead)}>{props.titleHead}</div>:
      <p style={{'backgroundColor': props.color}} className={classes.Menu}>NULL</p>;
    
}

  export default Menu;