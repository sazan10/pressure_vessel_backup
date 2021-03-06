import React, { Component } from "react";
import Menuu from '../../Components/UI/Menu/Menu';
// import Icon from '@material-ui/core/Icon';
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import { connect } from 'react-redux';
import * as data from "../../JSONFiles/Navigation/File.json";
import * as actions from '../../store/actions/index';
import Logout from '../Auth/Logout/Logout';
import Username from '../../Components/UI/Username/Username';
class Menu extends Component {

    state = {
        title: "Files",
        normalColor: '#dddddd',
        clickedColor: '#eeeeee',
    }

    onClickHandler1 = (e) => {
        //console.log(e);
        this.setState({ title: e });
    }

    onClickHandler2 = (e) => {
        //console.log("clicked",e);
        this.props.onMenuClick(e);
        this.props.componentClicked(false);
        switch (e) {
            case "Cylinder":
            case "Ellipsoidal Head":
            case "Conical":
            case "Skirt":
            case "Lifting Lug":
            case "Saddle":
            case "Nozzle":
                this.props.displayComponentTree(false);
                this.props.importModel(e, 1);
                this.props.sendComponentID(e, this.props.componentID, this.props.projectID);
                break;
            case "Tree":
                this.props.displayComponentTree(true);
                break;
            case "Open":
            case "New":
                this.props.importForm(e);
                this.props.openFormDialog(true);
                break;
            case "Print":
                this.props.displayComponentTree(false);
                this.props.downloadReport(this.props.projectID);
                this.props.showSpinner(true);
                break;
            case "Close":
                this.props.displayComponentTree(false);
                break;
            case "Undo":
                // this.props.deleteLastComponent();
                break;
            case "Delete":
                console.log("Delete Clicked");
                this.props.deleteSpecificComponent(this.props.projectID, this.props.selectedComponentID);
                break;
            case "Top View":
                this.props.changeView("TOP");
                break;
            case "Side View":
                this.props.changeView("SIDE");
                break;
            case "Front View":
                this.props.changeView("FRONT");
                break;
            case "Isometric View":
                this.props.changeView("ISOMETRIC");
                break;
            default:
                break;
        }
    }

    showSupportComponent=()=>{
        this.setState({showSupport:true})
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
            (this.props.projectID === null && (d.id === "Component" || d.id === "Support"))?null:
            ((d.id=== this.state.title)?
            <Menuu color={this.state.clickedColor} key={d.id} titleHead={d.id} selectItem={this.onClickHandler1}></Menuu>:
            <Menuu color={this.state.normalColor} key={d.id} titleHead={d.id} selectItem={this.onClickHandler1}></Menuu>)
            
        ));

        // console.log(this.state.title);
        const icon = data.default[this.state.title];

        const icons = icon.map(dd => (
            <IconNavbar  key={dd.id} selectItem={this.onClickHandler2} title={dd.title} orientation={this.props.orientation}></IconNavbar>
        ));

        return <div style={{'border-style': 'solid',
        'border-width':'0.2px 0px 0.2px 0px','background-color':'#dddddd'}}>
            <div >
                {menu}
                <Username username={this.props.username?this.props.username:localStorage.getItem('userId')}/>
                
            </div>
            <div>
                {icons}
                <Logout clickSupport={this.props.showSupport} />

            </div>
        </div>;
    }
}

const mapStateToProps = state => {
    return {
        componentID: state.componentData.componentID,
        projectID: state.projectData.projectID,
        orientation: state.projectData.orientation,
        selectedComponentID: state.componentData.selectedComponentID,
        username: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onMenuClick: (title) => dispatch(actions.clickMenu(title)),
        requestNewProject: () => dispatch(actions.requestNewProject()),
        downloadReport: (projectID) => dispatch(actions.downloadReport(projectID)),
        importModel: (title, num) => dispatch(actions.importComponentModel(title, num)),
        sendComponentID: (componentType, componentID, projectID) => dispatch(actions.sendComponentID(componentType, componentID, projectID)),
        openFormDialog: (value) => dispatch(actions.openFormDialog(value)),
        displayComponentTree: (value) => dispatch(actions.displayComponentTree(value)),
        importForm: (title) => dispatch(actions.importForm(title)),
        componentClicked: (value) => dispatch(actions.componentClicked(value)),
        deleteLastComponent: () => dispatch(actions.deleteLastComponent()),
        deleteSpecificComponent: (projectID, componentID) => dispatch(actions.deleteSpecificComponent(projectID, componentID)),
        showSpinner: (value) => dispatch(actions.showSpinner(value)),
        changeView: (value) => dispatch(actions.changeView(value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);