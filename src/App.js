import React, { Component } from 'react';
import classes from './App.css';
import DropDownMenu from './Components/UI/DropDownMenu/DropDownMenu';
import { Modal } from './Container/Modal/Modal';
import ComponentGroup from './Components/ComponentGroup';
class App extends Component {

  render() {
    return (
      <div className={classes.App}>
        <DropDownMenu />

        <div>
          <button onClick={Modal.open('custom-modal-1')}>Open Modal 1</button>
          <button onClick={Modal.open('custom-modal-2')}>Open Modal 2</button>
          <Modal id="custom-modal-1">
            <ComponentGroup tag="foo" />
          </Modal>
          <Modal id="custom-modal-2">
            <ComponentGroup tag="bar" />
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
