import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from './Input/Input';
import Button from '../../Components/UI/Button/Button';
import Spinner from '../../Components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
// import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import axios from '../../axios-orders';
class Auth extends Component {
    state = {
        controls: {
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
            firstName: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: 'First Name'
                },
                value: '',
                validation: {
                    required: true

                },
                valid: false,
                touched: false
            },
            middleName: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: 'Middle Name'
                },
                value: '',
                validation: {
                    required: false

                },
                valid: true,
                touched: false
            },
            lastName: {
                elementType: 'input',
                elementConfig: {
                    type: 'input',
                    placeholder: 'Last Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: '123@domain.com'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
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
                    minLength: 8
                },
                valid: false,
                touched: false
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8,
                    match: true
                },
                valid: true,
                touched: false
            }
        },
        isSignup: true,
        passMatch: false,
        valid: true,
        message: ""
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
            const updatedControls = {
                ...this.state.signUp,
                [controlName]: {
                    ...this.state.signUp[controlName],
                    value: event.target.value,
                    valid: this.checkValidity(event.target.value, this.state.signUp[controlName].validation),
                    touched: true
                }
            };
            this.setState({ signUp: updatedControls });
        } else {
            const updatedControls = {
                ...this.state.controls,
                [controlName]: {
                    ...this.state.controls[controlName],
                    value: event.target.value,
                    valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                    touched: true
                }
            };
            this.setState({ controls: updatedControls });


        }

    }

    submitHandler = (event) => {
        event.preventDefault();

        let data = null;
        if (this.state.isSignup) {
            data = {
                user: {
                    username: this.state.signUp.username.value,
                    firstName: this.state.signUp.firstName.value,
                    middleName: this.state.signUp.middleName.value,
                    lastName: this.state.signUp.lastName.value,
                    email: this.state.signUp.email.value,
                    password: this.state.signUp.password.value
                }
            };


        } else {
            data = {
                username: this.state.controls.username.value,
                password: this.state.controls.password.value,
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
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        });
    }

    render() {
        const formElementsArray = [];
        if (this.state.isSignup) {
            for (let key in this.state.signUp) {
                formElementsArray.push({
                    id: key,
                    config: this.state.signUp[key]
                });
            }
        } else {
            for (let key in this.state.controls) {
                formElementsArray.push({
                    id: key,
                    config: this.state.controls[key]
                });
            }
        }


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
            errorMessage = (
                <p>{this.props.error.message}</p>
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
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    {this.state.message}
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
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);