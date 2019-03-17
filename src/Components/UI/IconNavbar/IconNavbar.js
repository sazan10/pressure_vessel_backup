import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

const IconNavbar = (props) => {
    return <Button onClick={() => props.selectItem(props.title)}>{props.title}</Button>;
}  

export default IconNavbar;
