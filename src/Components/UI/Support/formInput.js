import React from 'react';

const formInput=(props)=>{

    switch(props.inputType)
    {
        case "select":
            return (  
            <div className="form-group">          
                <label>
                    {props.name}
                </label>
                <select className="form-control">
                    {props.option.map((app)=>(
                    <option key={app}>{app}</option>))}
                </select>
            </div>
            );
        case "input":
        case "textarea":
        let input =null;

        if(props.label==="Subject")
        {
            input=<input type={props.type} className={props.formControl}  aria-describedby="emailHelp" placeholder={props.placeholder} key={props.key1} onChange={props.onChange} required/>
        }
        else if(props.label==="Description")
        {
            input=<textarea type={props.type} className={props.formControl}  aria-describedby="emailHelp" placeholder={props.placeholder} key={props.key1} onChange={props.onChange} required/>
        }
        else if(props.label==="Attachment") {
            input=<input type={props.type} className={props.formControl} aria-describedby="emailHelp" placeholder={props.placeholder} key={props.key1} onChange={props.uploadAttachment} />
        }
            return (
            <div className="form-group">
                <label>{props.label} </label>
                {input}
            </div>);  
        default:
            return;
    }
}

export default formInput;