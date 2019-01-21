import React, { Component } from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';
import CylinderParam1 from '../../CylinderParam1/CylinderParam1';
class Modal extends Component {

    // shouldComponentUpdate ( nextProps, nextState ) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    componentWillUpdate () {
        console.log('[Modal] WillUpdate');
    }

    render () {
        return (
            <Aux>
                {/* <Backdrop show={true} clicked={this.props.modalClosed} /> */}
                <div
                    className={classes.Modal}
                    style={{
                        transform: true ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: true ? '1' : '0'
                    }}>
                    <CylinderParam1 />
                </div>
            </Aux>
        )
    }
}

export default Modal;