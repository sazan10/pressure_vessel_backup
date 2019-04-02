import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Tree, { getTreeLeafDataByIndexArray } from "material-ui-tree";

class TreeDemo extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  state = {
    alignRight: true,
    data: {
      component: "Components",
      type: "tree"
    }
  };

  requestTreeLeafChildrenData = (leafData, chdIndex, doExpand) => {
    // const { url, type } = leafData;
    const type = leafData.type;
    if (type === "tree") {
        const res = this.props.components;
        if (res) {
          const data = { ...this.state.data };
          getTreeLeafDataByIndexArray(data, chdIndex, "tree").tree = res;
          this.setState({ data }, () => {
            doExpand();
          });
        } else {
          doExpand();
        }
    
    } else {
      doExpand();
    }
  };

  renderTreeLeafLabel = (leafData, expand) => {
    const { classes } = this.props;
    const {component, type, componentID } = leafData;
    const newComponent = component + " " + componentID;
    if (type==="tree") {
      if (expand) {
        return (
          <Typography key={newComponent} variant="body1" className={classes.leaf}>
            <FolderOpenIcon className={classes.icon} />
            {component}
          </Typography>
        );
      }
      return (
        <Typography key={newComponent} variant="body1" className={classes.leaf}>
          <FolderIcon className={classes.icon} />
          {component}
        </Typography>
      );
    }
    if (type === "blob") {
      
      return (
        <Typography key={newComponent} variant="body2" className={classes.leaf}>
          <InsertDriveFileIcon className={classes.icon} />
          {newComponent}
        </Typography>
      );
    }
  };

  getTreeLeafActionsData = (leafData, chdIndex, expand) => {
    const { classes } = this.props;
    // const { type } = leafData;
    console.log("Actions", leafData);
    // const type = leafData.type;
    // if (type === "tree") {
    //   if (!expand) {
    //     return null;
    //   }
    //   return [
    //     {
    //       icon: <AddIcon className={classes.icon} />,
    //       label: "news",
    //       hint: "Insert file",
    //       onClick: () => {
    //         const data = { ...this.state.data };
    //         const leaf = getTreeLeafDataByIndexArray(data, chdIndex, "tree");
    //         console.log(leaf);
    //         if (
    //           !Reflect.has(leaf, "tree") ||
    //           !Reflect.has(leaf.tree, "length")
    //         ) {
    //           leaf.tree = [];
    //         }
    //         leaf.tree.push({
    //           path: "new file",
    //           type: "blob",
    //           sha: Math.random()
    //         });
    //         this.setState({ data });
    //       }
    //     }
    //   ];
    // }
    // return [
    //   {
    //     icon: <DeleteIcon color="secondary" className={classes.icon} />,
    //     hint: "Delete file",
    //     onClick: () => {
    //       const data = { ...this.state.data };
    //       const parent = getTreeLeafDataByIndexArray(
    //         data,
    //         chdIndex.slice(0, chdIndex.length - 1),
    //         "tree"
    //       );
    //       const lastIndex = chdIndex[chdIndex.length - 1];
    //       parent.tree.splice(lastIndex, 1);
    //       this.setState({ data });
    //     }
    //   }
    // ];
  };

  render() {
    console.log(this.props);
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Tree
          {...(this.state.alignRight ? { actionsAlignRight: false } : {})}
          className={classes.container}
          title="Components"
          data={this.state.data}
          labelName="path"
          valueName="sha"
          childrenName="tree"
          renderLabel={this.renderTreeLeafLabel}
          getActionsData={this.getTreeLeafActionsData}
          requestChildrenData={this.requestTreeLeafChildrenData}
        />
      </React.Fragment>
    );
  }
}

const styles = () => ({
  container: {
    margin: 0
  },
  icon: {
    fontSize: 20
  },
  leaf: {
    display: "flex",
    alignItems: "left"
  }
});

export default withStyles(styles, { withTheme: true })(TreeDemo);
