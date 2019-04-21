import React from 'react';
import classes from './Menu.css';

const Menu = (props) => {

      return <div style={{'background-color': props.color}} className={classes.Menu} onClick={() => props.selectItem(props.titleHead)}>{props.titleHead}</div>;
    
}

  export default Menu;