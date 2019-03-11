import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Switch, Route, withRouter } from "react-router-dom";
import DropDownMenu from "../../Components/UI/DropDownMenu/DropDownMenu";
import Modal from "../../Components/UI/Modal/Modal";
import * as navbarData from "../../JSONFiles/File.json";
import IconNavbar from '../../Components/UI/IconNavbar/IconNavbar';
import * as iconData from '../../JSONFiles/IconNavbar.json';
import { connect } from 'react-redux';
import Scene from '../Scene/Scene';
import {Redirect} from 'react-router-dom';
import SideModal from '../../Components/UI/SideModal/SideModal';
class VesselBuilder extends Component {

  componentDidMount() {
    console.log("ComponentDidMount");
    console.log(this.props.isAuthenticated);
      if(!this.props.isAuthenticated) {
        this.props.history.push("/");
      } 
  }
  render() {
    // const menu = navbarData.menu.map(d =>
    //   d[Object.keys(d)].map(dd => (
    //     <Route path={"/builder/" + dd.title} component={SideModal} />
    //   ))
    // );
    // const iconMenu = iconData.default.Icons.map(d => 
    //   <Route path={"/builder/hello"} component={Modal} />
    // );

    return (
      <div>
        <DropDownMenu />
        <IconNavbar/>
        {/* <Switch>
          {menu}
          {/* {iconMenu} */}
        {/* </Switch>  */}
        <Container fluid={true}>
          <Row >
            <Col  style={{margin: 0,padding: 0}} lg={2} md={3} xs={4} ><SideModal/></Col>
            <Col  style={{margin: 0,padding: 0}}  lg={10} md={9} xs={8} ><Scene></Scene></Col>
          </Row>
        </Container>
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

export default connect(mapStateToProps, null) (withRouter(VesselBuilder));
