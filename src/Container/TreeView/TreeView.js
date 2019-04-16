import React from "react";
import * as actions from "../../store/actions/index";
import TreeViewComp from "../../Components/TreeViewComp/TreeViewComp";
import { connect } from "react-redux";

const data = {
  name: "root",
  toggled: true,
  children: [
    {
      name: "parent",
      children: [{ name: "child1" }, { name: "child2" }]
    },
    {
      name: "loading parent",
      loading: true,
      children: []
    },
    {
      name: "parent",
      children: [
        {
          name: "nested parent",
          children: [{ name: "nested child 1" }, { name: "nested child 2" }]
        }
      ]
    }
  ]
};
class TreeDemo extends React.Component {
  state = {
    active: null,
    cursor: null,
    tree: { name: "Components", toggled: true, children: [] }
  };

  componentDidMount() {
    if (this.props.components !== null) {
      this.setTree(this.props.components);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.components !== this.props.components) {
      this.setTree(this.props.components);
    }
  }

  setTree = components => {
    const tree = { name: "Components", toggled: true, children: [] };
    components.map(component => {
      return tree.children.push({
        name: component.component + " " + component.componentID
      });
    });
    this.setState({ tree: tree });
  };

  onToggle = (node, toggled) => {
    console.log(node.name);
    if (this.state.cursor) {
      const cursor = {
        ...this.state.cursor,
        active: false
      };
      this.setState({ cursor: cursor });
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
    const name = node.name.split(" ");
    if(name.length >= 3) {
      name[0] = name[0] + name[1];
      name[1]= name[2];
    }
    this.props.treeUpdate(false);
    this.props.modelImport(name[0], 1);
    this.props.returnComponentID(parseInt(name[1]));
    this.props.componentClicked(true);
  };

  render() {
    const tree = (
      <TreeViewComp data={this.state.tree} onToggle={this.onToggle} />
    );
    return <div style={{ height: "100%", width: "100%" }}>{tree}</div>;
  }
}

const mapStateToProps = state => {
  return {
    components: state.componentData.component
  };
};

const mapDispatchToProps = dispatch => {
  return {
    treeUpdate: value => {
      dispatch(actions.displayComponentTree(value));
    },
    modelImport: (titleName, value) => {
      dispatch(actions.importModel(titleName, value));
    },
    returnComponentID: id => {
      dispatch(actions.returnComponentByID(id));
    },
    componentClicked: value => {
      dispatch(actions.componentClicked(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeDemo);
