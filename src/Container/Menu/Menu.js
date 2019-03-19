import React, { Component } from "react";
import Menuu from '../../Components/UI/Menu/Menu';
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import { connect } from 'react-redux';
import * as data from "../../JSONFiles/File.json";
import * as actions from '../../store/actions/index';

class Menu extends Component {

    state = {
        title: "Files"
    }

    onClickHandler1 = (e) => {
        console.log(e);
        this.setState({ title: e });
    }

    onClickHandler2 = (e) => {
        console.log(e);
        this.props.onMenuClick(e);
        switch (e) {
            case "Cylinder":
            case "Ellipsoidal Head":
            case "Conical":
            case "Skirt":
            case "Nozzle":
                this.props.importModel(e, 1);
                break;
            case "New":
                this.props.requestReport();
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

// const mapStateToProps = state => {
//     return {
//         loading: state.auth.loading,
//         error: state.auth.error,
//         isAuthenticated: state.auth.token !== null,
//         authRedirectPath: state.auth.authRedirectPath,
//         error: state.auth.error,
//         model: state.auth.model
//     };
// };

const mapDispatchToProps = dispatch => {
    return {
        onMenuClick: ( title) => dispatch( actions.clickMenu( title) ),
        requestReport: () => dispatch(actions.requestReport()),
        importModel: (title, num) => dispatch(actions.importModel(title, num))
    };
};

export default connect(null, mapDispatchToProps)(Menu);