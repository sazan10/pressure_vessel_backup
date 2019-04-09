import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TreeView from "deni-react-treeview";
import { connect } from "react-redux";

class TreeDemo extends React.Component {
  state = {
    items: [
    ]
  };

  componentDidMount() {
    console.log("Component Did Mount in TreeView", this.props.components);
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(this.props.components);
    if (prevProps.components !== this.props.components) {
      this.addItemAndSubItem();
    }
    
  };

  handleClick = item => {
    console.log("clicked", item);
  };

  addItemAndSubItem() {
    let api = this.refs.treeview.api;
    console.log(api);
    let rootNode = api.getRootItem();

    let newItem = api.addItem("Components", false, rootNode);
    this.props.components.map(component => {
          return api.addItem(component.component + " " + component.componentID, true, newItem);
          
        });
    // api.selectItem(newItem);
  }

  render() {
    console.log("Tree view rendering", this.state.items);
    const tree = (
      <TreeView
        style={{'width': '100%'}}
        ref="treeview"
        items={this.state.items}
        onSelectItem={item => this.handleClick(item)}
        theme="metro"
        showIcon={ false }
      />
    );
    return <div style={{'height': '100%'}}>{tree}</div>;
  }
}

const mapStateToProps = state => {
  return {
    components: state.componentData.component
  };
};

export default connect(
  mapStateToProps,
  null
)(TreeDemo);
