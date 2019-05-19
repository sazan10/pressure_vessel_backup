import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import List from './List';
import Button from "@material-ui/core/Button";
import ListItem from "@material-ui/core/ListItem";

//enzyme is connected
configure({ adapter: new Adapter() });

describe("<List />", () => {
  it("display list of projects", () => {
    const wrapper = shallow(<List />);
    wrapper.setProps({model:[{projectName: "hello", id: "1"}]});
    expect(wrapper.find(ListItem)).toHaveLength(1);
  });



})