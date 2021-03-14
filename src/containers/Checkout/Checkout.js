import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "../ContactData/ContactData";
import { Route } from "react-router-dom";

class Checkout extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
  };
  componentWillMount() {
    console.log("this.props.location.search " + this.props.location.search);
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      //[salad, 1]
      if (param[0] == "price") {
        price = +param[1];
      } else {
        ingredients[param[0]] = +param[1];
      }

      console.log(param);
    }
    this.setState({
      ingredients: ingredients,
      totalPrice: price,
    });
  }
  cancelledHandler = () => {
    this.props.history.goBack();
  };
  continuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };
  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.state.ingredients}
          cancelledClicked={this.cancelledHandler}
          continuedClicked={this.continuedHandler}
        />
        <Route
          path={this.props.match.url + "/contact-data"}
          render={(props) => (
            <ContactData
              ingredients={this.state.ingredients}
              totalPrice={this.state.totalPrice}
              {...this.props}
            />
          )}
        />
      </div>
    );
  }
}

export default Checkout;
