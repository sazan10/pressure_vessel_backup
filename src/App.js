import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DropDown from './UI/DropDownMenu';
import DropDownMenu from './UI/DropDownMenu';
class App extends Component {

  render() {
    return (
      <div className="App">
        <DropDownMenu />
      </div>
    );
  }
}

export default App;
