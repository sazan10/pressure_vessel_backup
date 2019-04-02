import React from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormInput from './FormInput';
const FormDialog = (props) => {
    // console.log("FOrm Dialog", props.model.default);
    const formElementsArray = [];
    for (let key in props.model.default) {
        formElementsArray.push({
            id: key,
            config: props.model.default[key]
        });
    }

    let form = formElementsArray.map(formElement => (
        
            <FormInput key={formElement.id} data={formElement.config} handleChange={props.handleChange} orientation={props.orientation}/>
    ));
return (
    <div>
        <DialogTitle id="form-dialog-title">New Project</DialogTitle>
        <DialogContent>
            <form noValidate autoComplete="off" onSubmit={props.submit}>
                {form}
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                        </Button>
                    <Button type="submit" color="primary">
                        Create
                        </Button>
                </DialogActions>
                
            </form>
        </DialogContent>
    </div>
);
}

export default FormDialog;