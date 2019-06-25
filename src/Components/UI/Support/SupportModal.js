import React from 'react';
import classes from './SupportModal.css';
import Aux from '../../../hoc/Auxx/Auxx';
import Backdrop from '../../../Components/UI/Backdrop/Backdrop'
const modal =(props)=>{
    return(
        <Aux>
            <Backdrop show={props.show} clicked={props.backDropOff} />
            <div className={classes.Modal}>
                {props.children}
            </div>
        </Aux>

    )
}

export default modal;