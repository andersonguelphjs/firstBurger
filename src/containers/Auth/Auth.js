import React, { Component } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";
import { updatedObject, checkValidity } from "../../shared/utility";

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your password",
        },
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    isSignUp: true,
  };
  componentDidMount() {
    if (!this.props.isBurgerBuilding && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
  }
  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      return { isSignUp: !prevState.isSignUp };
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  inputChangedHandler = (event, controlName) => {
    const updatedControls = updatedObject(...this.state.controls, {
      [controlName]: updatedObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      }),
    });
    //};
    this.setState({ controls: updatedControls });
  };
  render() {
    let formElementArray = [];
    for (let key in this.state.controls) {
      formElementArray.push({
        id: key,
        setup: this.state.controls[key],
      });
    }
    let form = formElementArray.map((formElement) => (
      <Input
        key={formElement.id}
        elementType={formElement.setup.elementType}
        elementConfig={formElement.setup.elementConfig}
        invalid={!formElement.setup.valid}
        shouldValidate={formElement.setup.validation}
        touched={formElement.setup.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
      />
    ));
    if (this.props.loading) {
      form = <Spinner />;
    }
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error.message}</p>;
    }
    let redirect = null;
    if (this.props.isAuthenticated)
      redirect = <Redirect to={this.props.authRedirectPath} />;
    return (
      <div className={classes.Auth}>
        {redirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          SWITCH TO {this.state.isSignUp ? "SIGN-IN" : "SIGN-UP"}
        </Button>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    isBurgerBuilding: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
