import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import IconNavbar from './IconNavbar';
import Button from "@material-ui/core/Button";

//enzyme is connected
configure({ adapter: new Adapter() });

describe("<IconNavbar />", () => {
  it("if saddle and vertical then return null", () => {
    const wrapper = shallow(<IconNavbar />);
    wrapper.setProps({ title: "Saddle", orientation: "vertical" });
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it("if skirt and horizontal then return null", () => {
    const wrapper = shallow(<IconNavbar />);
    wrapper.setProps({ title: "Skirt", orientation: "horizontal" });
    expect(wrapper.find(Button)).toHaveLength(0);
  });

})