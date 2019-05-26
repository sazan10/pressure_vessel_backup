import React from 'react';
import {configure, shallow} from 'enzyme';
import {VesselBuilder} from './VesselBuilder';
import Adapter from 'enzyme-adapter-react-16';
import TreeView from "../TreeView/TreeView";
import SideModal from "../../Components/UI/SideModal/SideModal";
import FormDialog from "../FormDialog/FormDialog";
import Spinner from "../../Components/UI/Spinner/Spinner";
import Menu from "../Menu/Menu";
// jest.mock('react-redux');
configure({adapter: new Adapter()});

describe('<VesselBuilder />', () => {

    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<VesselBuilder />);
    })
    it('should have treeview if componentTree equals to true', 
       () => {
         wrapper.setProps({componentTree: true});
         expect(wrapper.find(TreeView)).toHaveLength(1);
       });

    it('should have sidemodal if componentTree equals to false',() => {
        wrapper.setProps({componentTree: false});
        expect(wrapper.find(SideModal)).toHaveLength(1);
      });

      
      it('should open a form dialog',() => {
        wrapper.setProps({formDialogOpen: true});
        expect(wrapper.find(FormDialog)).toHaveLength(1);
      });

      it('should show a spinner',() => {
        wrapper.setProps({showSpinnerr: true});
        expect(wrapper.find(Spinner)).toHaveLength(1);
      });

      it('should have Menu',() => {
        expect(wrapper.find(Menu)).toHaveLength(1);
      });

});


