import React from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import FolderIcon from "@material-ui/icons/Folder";

const ListComp = props => {
  let projects = <p>No Projects Found</p>;
  if (props.model !== undefined && props.model !== null) {
    projects = props.model.map(formElement => (
      <ListItem
        key={formElement.id}
        onClick={event => props.handleClick(event, formElement.id)}
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={formElement.projectName}
          secondary={formElement.id}
        />
      </ListItem>
    ));
  }

  return (
    
    <Grid container spacing={16}>
      <Grid item xs={12} md={12}>
        {/* <div className={classes.demo}> */}
        <List dense={false}>
          {projects}
        </List>
        {/* </div> */}
      </Grid>
    </Grid>
    
  );
};

export default ListComp;
