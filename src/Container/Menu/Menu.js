import React, { Component } from "react";
import Menuu from '../../Components/UI/Menu/Menu';
import Icon from '@material-ui/core/Icon';
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import { connect } from 'react-redux';
import * as data from "../../JSONFiles/Navigation/File.json";
import * as actions from '../../store/actions/index';

class Menu extends Component {

    state = {
        title: "Files"
    }

    onClickHandler1 = (e) => {
        //console.log(e);
        this.setState({ title: e });
    }

    onClickHandler2 = (e) => {
        //console.log(e);
        this.props.onMenuClick(e);
        switch (e) {
            case "Cylinder":
            case "Ellipsoidal Head":
            case "Conical":
            case "Skirt":
            case "Lifting Lug":
            case "Saddle":
            case "Nozzle":
                this.props.importModel(e, 1);
                this.props.sendComponentID(e, this.props.componentID, this.props.projectID);
                break;
            case "Open":
                this.props.displayComponentTree(true);
                break;
            case "New":
                this.props.openFormDialog(true);
                break;
            case "Print":
                this.props.displayComponentTree(false);
                // this.props.downloadReport(this.props.projectID);
                break;
            default:
                break;
        }
    }

    render() {
        /** The dropdown menu is created from File.json file */
        // console.log(data.default);
        const menuArray = [];
        for (let key in data.default) {
            menuArray.push({
                id: key
            });
        }
        const menu = menuArray.map(d => (
            <Menuu key={d.id} titleHead={d.id} selectItem={this.onClickHandler1}></Menuu>
        ));

        // console.log(this.state.title);
        const icon = data.default[this.state.title];

        const icons = icon.map(dd => (
            <IconNavbar key={dd.id} selectItem={this.onClickHandler2} title={dd.title}></IconNavbar>
        ));

        return <div>
            <div>
                {menu}
            </div>
            <div>
                {icons}
            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        componentID: state.componentData.componentID,
        projectID: state.componentData.projectID
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onMenuClick: ( title) => dispatch( actions.clickMenu( title) ),
        requestReport: () => dispatch(actions.requestReport()),
        downloadReport: (projectID) => dispatch(actions.downloadReport(projectID)),
        importModel: (title, num) => dispatch(actions.importModel(title, num)),
        sendComponentID : (componentType, componentID, projectID) =>  dispatch(actions.sendComponentID(componentType, componentID, projectID)),
        openFormDialog: (value) => dispatch(actions.openFormDialog(value)),
        displayComponentTree: (value) => dispatch(actions.displayComponentTree(value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);