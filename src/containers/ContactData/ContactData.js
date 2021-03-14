import "./ContactData.module.css";
import React, { Component } from "react";
import classes from "./ContactData.module.css";
import Button from "../../components/UI/Button/Button";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import Input from "../../components/UI/Input/Input";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your address",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      postalCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your postal code",
        },
        value: "",
        validation: {
          required: true,
          minLength: 3,
          maxLength: 6,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        value: "fastest",
        valid: true,
        validation: {},
      },
    },
    loading: false,
    formIsValid: false,
  };

  orderConfirmed = (event) => {
    event.preventDefault();
    let formData = {};
    for (let formIdentifier in this.state.orderForm) {
      formData[formIdentifier] = this.state.orderForm[formIdentifier].value;
    }

    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice.toFixed(2),
      orderData: formData,
    };

    axios
      .post("/Orders.json", order)
      .then((response) => {
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch((error) => this.setState({ loading: false }));
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }
  inputChangedHandler = (event, inputIdentifier) => {
    let updatedOrderForm = { ...this.state.orderForm };
    let updatedFormElement = { ...updatedOrderForm[inputIdentifier] };

    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      event.target.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let identifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[identifier].valid && formIsValid;
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    let formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({
        id: key,
        setup: this.state.orderForm[key],
      });
    }
    let form = (
      <form onSubmit={this.orderConfirmed}>
        {formElementArray.map((formElement) => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.setup.elementType}
              elementConfig={formElement.setup.elementConfig}
              invalid={!formElement.setup.valid}
              shouldValidate={formElement.setup.validation}
              touched={formElement.setup.touched}
              changed={(event) =>
                this.inputChangedHandler(event, formElement.id)
              }
            />
          );
        })}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Your contact info</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
