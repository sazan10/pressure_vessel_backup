import React, { Component } from 'react';
import DropDown from './DropDown';
import './DropDownMenu.css';
import  * as data from '../JSONFiles/File.json';
class DropDownMenu extends Component {

    render() {
        return (
            <div className= "body">
                <DropDown
                    title="File"
                    list={data.Files}
                />
                <DropDown
                    title="Component"
                    list={data.Component}
                />
                <DropDown
                    title="Actions"
                    list={data.Actions}
                />
                <DropDown
                    title="Nozzle"
                    list={data.Nozzle}
                />
                <DropDown
                    title="Attach"
                    list={data.Attach}
                />
                <DropDown
                    title="Support"
                    list={data.Support}
                />
                <DropDown
                    title="Codes"
                    list={data.Codes}
                />
                <DropDown
                    title="Loads"
                    list={data.Loads}
                />
                <DropDown
                    title="Materials"
                    list={data.Materials}
                />
                <DropDown
                    title="Forms"
                    list={data.Forms}
                />
                <DropDown
                    title="Window"
                    list={data.Window}
                />
                <DropDown
                    title="Help"
                    list={data.Help}
                /> 

            </div>
        );
    }
}

export default DropDownMenu;