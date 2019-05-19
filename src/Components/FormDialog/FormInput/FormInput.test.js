import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import FormInput from './FormInput';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

//enzyme is connected
configure({ adapter: new Adapter() });

describe("<FormInput />", () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<FormInput />);
  });

  it("the input will render of type text", () => {
    wrapper.setProps({data:{type:'text'},orientation: 'vertical', handleChange:{}});
    expect(wrapper.find(TextField)).toHaveLength(0);
  });

  it("the input will render of type select", () => {
    wrapper.setProps({data:{type:'select'},orientation: 'vertical', handleChange:{}});
    expect(wrapper.find("div")).toHaveLength(0);
  });


})