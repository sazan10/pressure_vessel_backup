import React, { Component } from 'react';
// import * as data from '../../../JSONFiles/IconNavbar.json';
import classes from './IconNavbar.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { Link } from 'react-router-dom';
class IconNavBar extends Component {

    componentWillMount() {
        library.add(faIgloo);
    }
    // <img src={d.src} className={classes.iconsI} alt="hello" />

    click1 = () => {
        console.log("click1");
        this.props.onClick1();
    }
    click2 = () => {
        console.log("click2");
        this.props.onClick2(this.props.id);
    }
    click3 = () => {
        console.log("click3");
    }
    click4 = () => {
        console.log("click4");
    }
    render() {
        
        
        // const menu = data.default.Icons.map(d => (
        //     <div key={d.id} className={classes.icons}>
        //         <Link to={"/builder/hello"} key={d.id}></Link>
        //     </div>
        // )
        // );
        return (
            <div>
                <div className={classes.icons}>
                    <button className={classes.btn} onClick={this.click1}><FontAwesomeIcon icon="igloo" /></button>
                    <button className={classes.btn} onClick={this.click2}><FontAwesomeIcon icon="igloo" /></button>
                    <button className={classes.btn} onClick={this.click3}><FontAwesomeIcon icon="igloo" /></button>
                    <button className={classes.btn} onClick={this.click4}><FontAwesomeIcon icon="igloo" /></button>
                </div>
                <hr className={classes.iconsII} />
            </div>);
    }
}

const mapStateToProps = state => {
    return {
        id: state.componentData.projectID
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClick1: () => dispatch(actions.requestReport()),
        onClick2: (id) => dispatch(actions.downloadReport(id))
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconNavBar);