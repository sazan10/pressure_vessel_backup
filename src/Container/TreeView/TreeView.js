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
      console.log(
        "previous components are",
        prevProps.components,
        "latest components are",
        this.props.components
      );
      this.setTree(this.props.components);
    }
  }

  //building the tree based on components
  setTree = components => {
    console.log("setTree", components);
    const tree = { name: "Components", toggled: true, children: [] };
    components.map(component => {
      if (component !== null && component.component !== undefined) {
        return tree.children.push({
          name: component.componentName,
          component: component.component,
          id: component.componentID,
          key: component.componentID
        });
      }
    });
    this.setState({ tree: tree });
  };

  onToggle = (node, toggled) => {
    console.log(node.component);
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
    if (node.component !== "Components" && node.component!=="noComponent") {
      const name = node.component.split(" ");
      if (name.length >= 2) {
        name[0] = name[0] + " " + name[1];
      }
      console.log("Tree view component selected", name[0], node.id);
      this.props.updateSelectedComponentID(parseInt(node.id));
      this.props.treeUpdate(false);
      this.props.modelImport(name[0], 1);
      this.props.returnComponentID(parseInt(node.id));
      this.props.componentClicked(true);
    }
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
    //whether to display the component tree or the component form
    treeUpdate: value => {
      dispatch(actions.displayComponentTree(value));
    },
    //import the specific model like cylinder or nozzle etc for the component chosen based on
    //titleName
    modelImport: (titleName, value) => {
      dispatch(actions.importModel(titleName, value));
    },
    //to update the selected component in redux to display it in the side bar
    //based on the id chosen by the user by clicking a specific component in tree
    returnComponentID: id => {
      dispatch(actions.returnComponentByID(id));
    },
    //update the boolena value whether a component in tree is clicked or not
    componentClicked: value => {
      dispatch(actions.componentClicked(value));
    },
    //update the selectedComponentID field in redux to notify which component ID is selected
    updateSelectedComponentID: id => {
      dispatch(actions.updateSelectedComponentID(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeDemo);
