import React, { Component } from "react";
import DropDown from "./DropDown";
import "./DropDownMenu.css";
import * as data from "../JSONFiles/File.json";
class DropDownMenu extends Component {
  render() {
    const menu = data.menu.map(d => 
    //   let de = Object.keys(d);
      <DropDown
        key = {Object.keys(d)}
        title = {Object.keys(d)}
        list = {d[Object.keys(d)]} />
    );
    return (
      <div className="body">
        {menu}
      </div>
    );
  }
}

export default DropDownMenu;
