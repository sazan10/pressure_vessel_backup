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
        this.setState({
            form: this.props.model
        });
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        let data = {
            "component": this.props.title
        };
        for (let key in this.state.form) {
            data = {
                ...data,
                [key]: this.state.form[key].value
            }
        }

        let valid = this.state.valid;
        for (let key in this.state.form) {
            valid = valid & (this.state.form[key].valid);
        }
        if (valid) {
            this.props.onSubmitAndUpdate(data, this.props.projectID, this.props.componentID);
            this.setState({ message: null });
        } else {
            this.setState({ message: <p>Data not valid</p> });
        }
        this.props.history.push('/builder');

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.model !== this.props.model || this.props.new) {
            this.props.disableNew();
            this.props.model.componentID.placeholder = this.props.componentID;
            this.props.model.componentID.value = this.props.componentID;
            this.setState({ form: this.props.model });
        }

        // if(this.state.)
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
        // console.log(event, controlName);
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
        // // formElementsArray[0]
        // if (formElementsArray[0] !== undefined) {
        //     console.log(formElementsArray[0].config);
        //     formElementsArray[0].config.placeholder = this.props.componentID;
        //     formElementsArray[0].config.value = this.props.componentID;
        // }
        let form = formElementsArray.map(formElement => (
            <tr key={formElement.id} >
                <td style={{ width: '60%' }}><label style={{ margin: 0 }} className={classes.Label}>{formElement.config.label}</label></td>
                <td><Input style={{ padding: 0 }} key={
                    formElement.id
                }
                    elementType={
                        formElement.config.elementType
                    }
                    elementConfig={
                        formElement.config.elementConfig
                    }
                    value={
                        formElement.config.value
                    }
                    invalid={
                        !formElement.config.valid
                    }
                    shouldValidate={
                        formElement.config.validation
                    }
                    touched={
                        formElement.config.touched
                    }
                    changed={
                        (event) => this.inputChangedHandler(event, formElement.id)
                    }
                /></td>
            </tr>
        ));
        return <table><tbody>{form}</tbody></table>;


    }

    render() {
        let title = this.props.title || "Dynamic Form";
        // console.log(this.props.model);

        return (
            <div >
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
        thickness: state.componentData.thickness,
        projectID: state.componentData.projectID,
        error: state.componentData.error,
        componentID: state.componentData.componentID,
        new: state.navigation.new
    };
};

const mapDispatchToProps = dispatch => {
    return {
        importModel: (title, num) => dispatch(actions.importModel(title, num)),
        disableNew: () => dispatch(actions.disableNew()),
        onSubmitAndUpdate: (data, id, componentID) => dispatch(actions.onSubmitAndUpdate(data, id, componentID))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DynamicForm));