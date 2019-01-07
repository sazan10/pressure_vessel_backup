import React, { Component } from 'react';
import DropDown from './DropDown';
import './DropDownMenu.css';
class DropDownMenu extends Component {

    constructor() {
        super()
        this.state = {
            Files: [
                {
                    id: 0,
                    title: 'New',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 1,
                    title: 'Vessel Wizard',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 2,
                    title: 'Open',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 3,
                    title: 'Close',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 4,
                    title: 'Save',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 5,
                    title: 'Save As',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 6,
                    title: 'Save All',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 7,
                    title: 'Save Vessel Picture',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 8,
                    title: 'Export',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 9,
                    title: 'HTRI Interface',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 10,
                    title: 'Print',
                    selected: false,
                    key: 'File'
                },
                {
                    id: 11,
                    title: 'Exit',
                    selected: false,
                    key: 'File'
                }
            ],
            Component: [{
                id: 0,
                title: 'Exit',
                selected: false,
                key: 'Component'
            }],
            Actions: [],
            Nozzle: [],
            File: [],
            Attach: [],
            Support: [],
            Codes: [],
            Loads: [],
            Materials: [],
            Forms: [],
            Window: [],
            Help: []
        }
    }

    render() {
        return (
            <div className= "body">
                <DropDown
                    title="File"
                    list={this.state.Files}
                />
                <DropDown
                    title="Component"
                    list={this.state.Component}
                />
                <DropDown
                    title="Actions"
                    list={this.state.Actions}
                />
                <DropDown
                    title="Nozzle"
                    list={this.state.Nozzle}
                />
                <DropDown
                    title="Attach"
                    list={this.state.Attach}
                />
                <DropDown
                    title="Support"
                    list={this.state.Support}
                />
                <DropDown
                    title="Codes"
                    list={this.state.Codes}
                />
                <DropDown
                    title="Loads"
                    list={this.state.Loads}
                />
                <DropDown
                    title="Materials"
                    list={this.state.Materials}
                />
                <DropDown
                    title="Forms"
                    list={this.state.Forms}
                />
                <DropDown
                    title="Window"
                    list={this.state.Window}
                />
                <DropDown
                    title="Help"
                    list={this.state.Help}
                /> 

            </div>
        );
    }
}

export default DropDownMenu;