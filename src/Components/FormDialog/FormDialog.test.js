import React from "react";
import { configure, shallow,mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import FormDialog from './FormDialog';
import FormInput from "./FormInput/FormInput";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";

//enzyme is connected
configure({ adapter: new Adapter() });
const data = {
  "projectName": {
      "margin": "dense",
      "id": "name",
      "label": "Project Name",
      "type": "text"
  },
  "orientation": {
      "margin": "dense",
      "id": "name",
      "label": "vertical",
      "type": "select"
  }
}

describe("<FormDialog />", () => {
  
  it("if model is there, then FormInput is rendered depending on number of input elements", () => {
    const wrapper = mount(<FormDialog />);
    wrapper.setProps({model: data });
    expect(wrapper.find(FormInput)).toHaveLength(2);
    wrapper.unmount(<FormDialog />);
  });

  it("if project name is not given then create button is disabled", () => {
    const wrapper = shallow(<FormDialog />);
    wrapper.setProps({disabled: false });
    expect(wrapper.contains(<Button type="submit" color="primary">
    Creates
  </Button>)).toEqual(false);
    wrapper.unmount(<FormDialog />);
  });



})
