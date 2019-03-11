import React from 'react';
// import ReactDOM from 'react-dom';
import {
    withRouter
} from 'react-router-dom';
import * as actions from '../../store/actions/index';
import classes from './Forms.css';
import {
    connect
} from 'react-redux';
import Input from '../../Container/Auth/Input/Input';
import Button from '../UI/Button/Button';

const initialState = {
    form: {},
    data: {},
    passMatch: false,
    valid: true,
    message: ""
};
class DynamicForm extends React.Component {
    constructor() {
        // console.log("Form Refreshed");
        super();
        this.state = initialState;
    }

    state = {
        form: {},
        data: {},
        passMatch: false,
        valid: true,
        message: ""
    }


    componentDidMount() {
        // console.log("COmponent DId Mount Form");
        this.setState({
            form: this.props.model
        });
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        // console.log(this.state.form);
        let data = {};
        for (let key in this.state.form) {
            data = {
                ...data,
                [key]: this.state.form[key]
            }
            // data.push({
            //     name: key,
            //     value: this.state.form[key].value
            // });
        }
        // console.log(data);

        let valid = this.state.valid;
        console.log(this.state.form["ip"].valid);
        for (let key in this.state.form) {
            console.log(this.state.form[key].valid);
            valid = valid & (this.state.form[key].valid);
            if(!this.state.form[key].valid) {
                console.log(this.state.form[key].valid)
            }
        }
        if (valid || !this.state.form) {
            // this.props.onAuth(data, this.state.form);
            this.setState({ message: null });
        } else {
            this.setState({ message: <p>Data not valid</p> });
        }

    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        console.log(event, controlName);
        const updatedForm = {
            ...this.state.form,
            [controlName]: {
                ...this.state.form[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.form[controlName].validation),
                touched: true
            }
        };
        this.setState({
            form: updatedForm
        });

    }

    renderForm = () => {
        // console.log(this.state.form);
        const formElementsArray = [];
        for (let key in this.state.form) {
            formElementsArray.push({
                id: key,
                config: this.state.form[key]
            });
        }
        // console.log(formElementsArray);
        let form = formElementsArray.map(formElement => ( <
            Input key = {
                formElement.id
            }
            elementType = {
                formElement.config.elementType
            }
            elementConfig = {
                formElement.config.elementConfig
            }
            value = {
                formElement.config.value
            }
            invalid = {
                !formElement.config.valid
            }
            shouldValidate = {
                formElement.config.validation
            }
            touched = {
                formElement.config.touched
            }
            changed = {
                (event) => this.inputChangedHandler(event, formElement.id)
            }
            />
        ));
        // console.log(form);
        return form;


    }

    render() {
        let title = this.props.title || "Dynamic Form";

        return ( 
            <div className={classes.dynamic_form}>
            <form onSubmit={this.onSubmitHandler}>
                    {this.renderForm()}
                    {this.state.message}
                    
                    <Button btnType="Success" disabled="true">SUBMIT</Button>
            </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        title: state.navigation.title,
        model: state.navigation.model,
        num: state.navigation.num,
        thickness: state.componentData.thickness
    };
};

const mapDispatchToProps = dispatch => {
    return {
        importModel: (title, num) => dispatch(actions.importModel(title, num)),
        dataUpdate: (data) => dispatch(actions.dataUpdate(data)),
        onSubmitAndUpdate: (data) => dispatch(actions.onSubmitAndUpdate(data))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DynamicForm));