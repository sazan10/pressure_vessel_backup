    import React from 'react';
import Aux from '../../../hoc/Auxx/Auxx';
import Button from '@material-ui/core/Button/Button';
import FormInput from './formInput';

const Support =(props)=>{

    //pic, app, description, subject, need
 let apps=["Vessel Express"];
    return(
        <Aux>
            <div>
            <form>
            <FormInput inputType="select" name="App Name" option={apps}/>
            <FormInput inputType="input" formControl ="form-control" type="text" label="Subject" placeholder="Subject"/>
            <FormInput inputType="textarea" formControl="form-control" type="text" label="Description" placeholder="Description" />
            <FormInput inputType="input" formControl="form-control-file" type= "file" label="Attachment" placeholder="Attachment"  uploadAttachment={props.uploadAttachment}/>
  <button type="submit" className="btn btn-primary" onClick={props.onSubmitTicket}>Submit</button>
</form>
                 
            </div>
        </Aux>

    )
}


export default Support;