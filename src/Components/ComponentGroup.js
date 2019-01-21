import React, { Component } from 'react';
import Component1 from './Component1';
import Component2 from './Component2';
import cylinderparam1 from './CylinderParam1/CylinderParam1';
import CylinderParam2 from './CylinderParam2/CylinderParam2';
class ComponentGroup extends Component {

    components = {
        "cylinder": cylinderparam1,
        foo: CylinderParam2
    };

    render() {
        const {title, id, stateKey} = this.props.tag;
        console.log(title + " " + id + " " + stateKey);
       const TagName = this.components[`${stateKey}`];
    // const $component = 'Cylinder'.toLowerCase();
    // return <$component />;
       return <TagName />
    // console.log(String(this.props.tag));
    // return null;
    }
}


export default ComponentGroup;