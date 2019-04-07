import React from 'react';
import Button from '@material-ui/core/Button';
import classes from './IconNavbar.css';

const IconNavbar = (props) => {
    return (
        <Button onClick={() => props.selectItem(props.title)} className={classes.Icons1}>
            {props.title}
            {/* <img src={a} alt="Fuck Pritesh" height="30px" width="30px"/> */}
        </Button>
    );
}

export default IconNavbar;
