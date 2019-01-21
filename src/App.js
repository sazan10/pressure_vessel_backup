import React, { Component } from "react";
import Auth from "./Container/Auth/Auth";
import { Route, Switch, withRouter } from "react-router-dom";
import classes from "./App.css";
import { connect } from "react-redux";
import VesselBuilder from "./Container/VesselBuilder/VesselBuilder";

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <Switch>
          <Route path="/builder" component={VesselBuilder} />
          <Route exact path="/" component={Auth} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: state.navigation.title,
    id: state.navigation.id,
    stateKey: state.navigation.stateKey
  };
};

export default withRouter(connect(mapStateToProps)(App));
