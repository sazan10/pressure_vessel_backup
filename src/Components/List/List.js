import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';

const ListComp = (props) => {
    const formElementsArray = [];
    for (let key in props.model.default) {
        formElementsArray.push({
            id: key,
            config: props.model.default[key]
        });
    }

    let projects = formElementsArray.map(formElement => (
        <ListItem key={formElement.id} onClick={(event) => props.handleClick(event, formElement.id)}>
            <ListItemAvatar>
                <Avatar>
                    <FolderIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary= {formElement.id}
                secondary={formElement.config.name}
            />
        </ListItem>
    ));

    return (
        <Grid container spacing={16}>
            <Grid item xs={12} md={6}>
                {/* <div className={classes.demo}> */}
                <List dense={false}>
                    {projects}
                </List>
                {/* </div> */}
            </Grid>
        </Grid>
    )
}

export default ListComp;