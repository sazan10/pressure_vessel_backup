import React, { Component } from 'react';
import Component1 from './Component1';
import Component2 from './Component2';
import CylinderParam1 from './CylinderParam1/CylinderParam1';

class ComponentGroup extends Component {

    components = {
        foo: CylinderParam1,
        bar: Component2
    };

    render() {
       const TagName = this.components[this.props.tag || 'foo'];
       return <TagName />
    }
}

export default ComponentGroup;