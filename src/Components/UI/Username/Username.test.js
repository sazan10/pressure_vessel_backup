import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PermIdentity from '@material-ui/icons/PermIdentity';
import Username from './Username';

//enzyme is connected
configure({adapter: new Adapter()});

describe('<Username />', () => {
    it('should have an icon', 
       () => {
         const wrapper = shallow(<Username />);
         expect(wrapper.find(PermIdentity)).toHaveLength(1);
       });
});

describe('<Username />', () => {
  it('should render username if logged in', 
     () => {
       const wrapper = shallow(<Username username={"calcgen"}/>);
       expect (wrapper.find('div')).toHaveLength(1);
     });
});