import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import a from '../../../assets/icons/conical.svg';
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
