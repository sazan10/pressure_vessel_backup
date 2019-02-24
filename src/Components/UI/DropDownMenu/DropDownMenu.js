import React, { Component } from "react";
import { connect } from 'react-redux';
import DropDown from "../DropDown/DropDown";
import classes from "./DropDownMenu.css";
import * as data from "../../../JSONFiles/File.json";
// import * as actions from '../../../store/actions/index';

class DropDownMenu extends Component {
  render() {
    /** The dropdown menu is created from File.json file */
    // console.log(this.props.title + " " + this.props.id + " " + this.props.stateKey);
    const menu = data.menu.map(d => (
      <DropDown
        key={Object.keys(d)}
        titleHead={Object.keys(d)}
        list={d[Object.keys(d)]}
      />
    ));
    return <div className={classes.body}>{menu}</div>;
  }
}

const mapStateToProps = state => {
  return {
      title: state.navigation.title,
      id: state.navigation.id,
      stateKey: state.navigation.stateKey,
      
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//       onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
//       onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
//   };
// };

export default connect( mapStateToProps )( DropDownMenu );

