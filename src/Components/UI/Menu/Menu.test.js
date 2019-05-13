import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Menu from './Menu';

//enzyme is connected
configure({ adapter: new Adapter() });

describe("<Menu />", () => {
  it("should display title head if available otherwise null", () => {
    const wrapper = shallow(<Menu />);
    wrapper.setProps({ titleHead: "Hello" });
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should display NULL if no title head", () => {
    const wrapper = shallow(<Menu />);
    wrapper.setProps({ titleHead: null });
    expect(wrapper.find("p")).toHaveLength(1);
  });

})