import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SideModal from "./SideModal";
import DynamicForm from "../../Forms/Forms";

//enzyme is connected
configure({ adapter: new Adapter() });

describe("<SideModal />", () => {
  it("should load dynamic form for components", () => {
    const wrapper = shallow(<SideModal />);
    wrapper.setProps({ model: true, projectID: false });
    expect(wrapper.find(DynamicForm)).toHaveLength(1);
  });

  it("Start adding components", () => {
    const wrapper = shallow(<SideModal />);
    wrapper.setProps({ projectID: true, model: false });
    expect(wrapper.find("p")).toHaveLength(1);
  });

  it("should welcome the user and ask to create new project", () => {
    const wrapper = shallow(<SideModal />);
    wrapper.setProps({ model: false, projectID: false });
    expect(wrapper.find("p")).toHaveLength(1);
  });
});
