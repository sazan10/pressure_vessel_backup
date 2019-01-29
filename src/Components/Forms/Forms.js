import React from 'react';
import ReactDOM from 'react-dom';
import classes from './Forms.css';

export default  class DynamicForm extends React.Component {
    state ={};

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.defaultValues && Object.keys(nextProps.defaultValues).length) {
            return {
                ...nextProps.defaultValues
            }
        } else {
            // Assign default values of "" to our controlled input
            // If we don't do this, React will throw the error
            // that Input elements should not switch from uncontrolled to controlled 
            // or (vice versa)
            // console.log(nextProps.model);
            if(nextProps.model !== null && nextProps.model.type === Object){
            let initialState = nextProps.model.reduce((acc, m) => {
                acc[m.key] = m.value ? m.value : "";
                return acc;
            },{});
            // console.log("initialState: ", initialState);
            return {
                ...initialState
            }
        } else {
            return null;
        }
        }
    }

    onSubmit = (e) => {
        console.log(this.state);
        e.preventDefault();
        if (this.props.onSubmit) this.props.onSubmit(this.state);
    }

    onChange = (e, key,type="single") => {
        console.log(this.state);
        // console.log(`${key} changed ${e.target.value} type ${type}`);
        if (type === "single") {
            this.setState({
                [key]: e.target.value  
            });
        } else {
            // Array of values (e.g. checkbox): TODO: Optimization needed.
            let found = this.state[key] ?  
                            this.state[key].find ((d) => d === e.target.value) : false;
            
            if (found) {
                let data = this.state[key].filter((d) => {
                    return d !== found;
                });
                this.setState({
                    [key]: data
                });
            } else {
                this.setState({
                    [key]: [e.target.value, ...this.state[key]]
                });
            }
        }
    }


    renderForm = () => {
        console.log("Form" + this.props.model);
        if(this.props.model !== null ) {
        let model = this.props.model;
        let defaultValues = this.props.defaultValues;
        console.log(model);
        let formUI = model.map((m) => {
            // console.log(m);
            let superKey = null;
            let formComponent = m.map((mmm) => {
                
                let key = mmm.key;
                superKey = key;
                let type = mmm.type || "text";
                let props = mmm.props || {};
                let name= mmm.name;
                let value = mmm.value;

                let target = key;  
                value = this.state[target];

                let input =  <input {...props}
                        className={classes.form_input}
                        type={type}
                        key={key}
                        name={name}
                        onChange={(e)=>{this.onChange(e, target)}}
                    />;

                if (type === "radio") {
                   input = mmm.options.map((o) => {
                       let checked = o.value === value;
                        return (
                            <React.Fragment key={'fr' + o.key}>
                                <input {...props}
                                        className={classes.form_input}
                                        type={type}
                                        key={o.key}
                                        name={o.name}
                                        checked={checked}
                                        value={o.value}
                                        onChange={(e)=>{this.onChange(e, o.name)}}
                                />
                                <label key={"ll" +o.key }>{o.label}</label>
                            </React.Fragment>
                        );
                   });
                   input = <div className ={classes.form_group_radio}>{input}</div>;
                }

                if (type === "select") {
                    input = mmm.options.map((o) => {
                        let checked = o.value === value;
                        // console.log("select: ", o.value, value);
                             return (
                                    <option {...props}
                                        className={classes.form_input}
                                        key={o.key}
                                    value={o.value}
                                >{o.value}</option>
                         );
                    });

                    // console.log("Select default: ", value);
                    input = <select value={value} onChange={(e)=>{this.onChange(e, mmm.key)}}>{input}</select>;
                 }

                 if (type === "checkbox") {
                        input = mmm.options.map((o) => {

                        let checked = o.value === value;
                        // let checked = false;
                        if (value && value.length > 0) {
                            checked = value.indexOf(o.value) > -1 ? true: false;
                        }
                        console.log("Checkbox: ",checked);
                         return (
                            <React.Fragment key={"cfr" + o.key}>
                                <input {...props}
                                    className={classes.form_input}
                                    type={type}
                                    key={o.key}
                                    name={o.name}
                                    checked={checked}
                                    value={o.value}
                                    onChange={(e)=>{this.onChange(e, m.key,"multiple")}}
                                />
                                <label key={"ll" +o.key }>{o.label}</label>
                            </React.Fragment>
                         );
                    });

                    input = <div className ={classes.form_group_checkbox}>{input}</div>;

                }
            
                return (
                    <div key={'g' + key} className={classes.form_group}>
                        <label className={classes.form_label}
                            key={"l" + key}
                            htmlFor={key}>
                            {mmm.label}
                        </label>
                        {input}
                    </div>
                );
            });
            return (
                <div key={superKey} className={classes.line}>{formComponent}</div>);
        });
        return formUI;
    } else {
        return null;
    }
    
    }

    render () {
        let title = this.props.title || "Dynamic Form";

        return (
            <div >
                <h3 className={classes.form_title}>{title}</h3>
                <form className={classes.dynamic_form} onSubmit={(e)=>{this.onSubmit(e)}}>
                    {this.renderForm()}
                    <div className={classes.form_actions}>
                        <button type="submit">submit</button>
                    </div>
                </form>
            </div>
        )
    }
}