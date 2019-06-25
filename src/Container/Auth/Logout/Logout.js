import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button/Button';
import * as actions from '../../../store/actions/index';
class Logout extends Component {
    state = {
        logout: false,
        showSupport:false
    }
    componentDidMount () {
    }
    onLogout =() => {
        console.log("Logout clicked");
        this.setState({logout: true});
        this.props.onLogout();
    }

    render () {
        let logout = null;
        if(this.state.logout) {
            logout = <Redirect to="/" />;
        }
        return(
            <div style={{'float':'right','clear':'left','right':'0px','display':'inline-flex','position': 'absolute'}}>
                <Button  style={{'float':'right','clear':'right','display':'inline-flex'}} onClick={this.props.clickSupport}> 
                    Support
                </Button>
                {/* <Button  style={{'float':'right','clear':'right','display':'inline-flex'}} > 
                    Forum
                </Button> */}
                <Button onClick={this.onLogout}>
                    Logout
                </Button>
                {logout}</div>
        );
    }
}

const mapDispatchToProps = dispatch=>{
    return{
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);