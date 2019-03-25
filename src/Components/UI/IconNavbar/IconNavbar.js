import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SvgIcon from '@material-ui/core/SvgIcon';
import a from '../../../assets/icons/bulb.svg';


const IconNavbar = (props) => {
    return (
        <Button onClick={() => props.selectItem(props.title)}>
            {props.title}
        </Button>
    );
}

export default IconNavbar;
