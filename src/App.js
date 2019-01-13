import React, { Component } from 'react';
import './App.css';
import DropDownMenu from './Components/UI/DropDownMenu/DropDownMenu';
import { Modal } from './Container/Modal/Modal';
import ComponentGroup from './Components/ComponentGroup';
class App extends Component {

  render() {
    return (
      <div className="App">
        <DropDownMenu />

        <div>
          <button onClick={Modal.open('custom-modal-1')}>Open Modal 1</button>

          <Modal id="custom-modal-1">
            <ComponentGroup tag="foo" />
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
