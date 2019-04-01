import React from 'react';
import TextField from '@material-ui/core/TextField';


const FormDialog = (props) => {
    let element = null;
    switch (props.data.type) {
        case "text":
            element = <TextField autoFocus {...props.data} onChange={(event) => props.handleChange(event, 'projectName')} />;
            break;
        case "list":
            // element = <p onClick={}>Hello</p>
            break;
        default:
            break;
    }
    return element;
}

export default FormDialog;