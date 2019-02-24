import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import classes from './DropDown.css';
import * as actions from '../../../store/actions/index';

class Dropdown extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.titleHead
    }
    this.close = this.close.bind(this)
  }

  componentDidUpdate(){
    const { listOpen } = this.state
    setTimeout(() => {
      if(listOpen){
        window.addEventListener('click', this.close)
      }
      else{
        window.removeEventListener('click', this.close)
      }
    }, 0)
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.close)
  }

  close(timeOut){
    this.setState({
      listOpen: false
    })
  }

  selectItem(title, id, stateKey){
    // console.log("DropDown" + title + " " + id + " " + stateKey);
    this.setState({
      headerTitle: stateKey,
      listOpen: false
    });
    this.props.onMenuClick(title, id, stateKey);
    this.props.importModel(title, this.props.num);
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render(){
    const{list} = this.props
    const{listOpen, headerTitle} = this.state
    return(
      <div className={classes.dd_wrapper}>
        <div className={classes.dd_header} onClick={() => this.toggleList()}>
          <div className={classes.dd_header_title}>{headerTitle}</div>
          {/* {listOpen
            ? <FontAwesome name="angle-up" size="2x"/>
            : <FontAwesome name="angle-down" size="2x"/>
          } */}
        </div>
        {listOpen && <ul className={classes.dd_list} onClick={e => e.stopPropagation()}>
          {list.map((item)=> (
            <Link to={"/builder/" + item.title} key={item.id}><li className={classes.dd_list_item}  onClick={() => this.selectItem(item.title, item.id, item.key)}>{item.title}{item.selected && <FontAwesome name="check"/>}</li></Link>
          ))}
        </ul>}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      num: state.navigation.num
  };
};
const mapDispatchToProps = dispatch => {
  return {
      onMenuClick: ( title, id, stateKey ) => dispatch( actions.clickMenu( title, id, stateKey ) ),
      importModel: (title, id, stateKey, num) => dispatch( actions.importModel( title, id, stateKey, num ) )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);