import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from './Input/Input';
import Button from '../../Components/UI/Button/Button';
import Spinner from '../../Components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        signIn: {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: 'Username'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        signUp: {
            
        },
        isSignup: false,
        passMatch: false,
        valid: true,
        message: ""
    }

    componentDidMount() {
        this.props.importAuthModel(!this.state.isSignup);
    }

    // componentDidMount() {
    //     if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
    //         this.props.onSetAuthRedirectPath();
    //     }
    // }

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

        if (rules.match) {
            isValid = value === this.state.signUp.password.value ? true : false;
            this.setState({ passMatch: isValid });
        }

        return isValid;
    }

    inputChangedHandler = (event, controlName) => {
        if (this.state.isSignup) {
            const updatedsignIn = {
                ...this.state.signUp,
                [controlName]: {
                    ...this.state.signUp[controlName],
                    value: event.target.value,
                    valid: this.checkValidity(event.target.value, this.state.signUp[controlName].validation),
                    touched: true
                }
            };
            this.setState({ signUp: updatedsignIn });
        } else {
            const updatedSignIn = {
                ...this.state.signIn,
                [controlName]: {
                    ...this.state.signIn[controlName],
                    value: event.target.value,
                    valid: this.checkValidity(event.target.value, this.state.signIn[controlName].validation),
                    touched: true
                }
            };
            this.setState({ signIn: updatedSignIn });


        }

    }

    submitHandler = (event) => {
        event.preventDefault();

        let data = null;
        if (this.state.isSignup) {
            data = {
                user: {
                    username: this.state.signUp.username.value,
                    first_name: this.state.signUp.firstName.value,
                    middle_name: this.state.signUp.middleName.value,
                    last_name: this.state.signUp.lastName.value,
                    email: this.state.signUp.email.value,
                    password: this.state.signUp.password.value
                }
            };


        } else {
            data = {
                username: this.state.signIn.username.value,
                password: this.state.signIn.password.value,
            }
        }
        let valid = this.state.valid;

        for (let key in this.state.signUp) {
            valid = valid & (this.state.signUp[key].valid);
        }
        if (valid || !this.state.isSignup) {
            this.props.onAuth(data, this.state.isSignup);
            this.setState({ message: null });
        } else {
            this.setState({ message: <p>Data not valid</p> });
        }
    }

    switchAuthModeHandler = () => {
        if(!this.state.isSignup) {
            this.setState({signUp: this.props.model});
        }
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        });
    }

    render() {
        // console.log(this.state.signIn);
        const formElementsArray = [];
        if (this.state.isSignup) {
            for (let key in this.state.signUp) {
                formElementsArray.push({
                    id: key,
                    config: this.state.signUp[key]
                });
            }
        } else {
            for (let key in this.state.signIn) {
                formElementsArray.push({
                    id: key,
                    config: this.state.signIn[key]
                });
            }
        }


        // console.log(formElementsArray);
        let form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ));

        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;

        if (this.props.error) {
            let message = null;
            if (!this.state.isSignup) {
                message = this.props.error.data.errors.error[0]
            } else {
                message = this.props.error.data.errors.error.map(d => {
                    return <div key={d}>{d}</div>
                })
            }
            errorMessage = (
                <p>{message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }



        // console.log("Inside Auth" + this.props.isAuthenticated);
        return (
            <div className={classes.Auth}>
                {authRedirect}

                <form onSubmit={this.submitHandler}>
                    {form}
                    {this.state.message}
                    {errorMessage}
                    <Button btnType="Success" disabled="true">SUBMIT</Button>
                </form>

                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        error: state.auth.error,
        model: state.auth.model
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        importAuthModel: (isSignup) => dispatch(actions.importAuthModel(isSignup))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);