import React, { Component } from 'react';
import Component1 from './Component1';
import Component2 from './Component2';

class ComponentGroup extends Component {

    components = {
        foo: Component1,
        bar: Component2
    };

    render() {
       const TagName = this.components[this.props.tag || 'foo'];
       return <TagName />
    }
}

export default ComponentGroup;