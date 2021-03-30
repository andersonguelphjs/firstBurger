import React, { Component } from "react";
import Aux from "../../../hoc/_Aux/_Aux";
import Button from "../../UI/Button/Button";

class OrderSummary extends Component {
  //this could be a functional compnenent (dependent on Modal)
  componentWillUpdate() {}
  render() {
    return (
      <Aux>
        <p>
          <strong>Your order summary...</strong>
        </p>
        <p>A delicious burger containing:</p>
        <ul>
          {Object.keys(this.props.ingredients).map((igKey) => {
            return (
              <li key={igKey}>
                <span style={{ textTransform: "capitalize" }}>{igKey}</span>:
                {this.props.ingredients[igKey]}
              </li>
            );
          })}
        </ul>
        <p>
          Total price: <strong>$ {this.props.price.toFixed(2)}</strong>
        </p>
        <p>Continue to checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCancelled}>
          CANCEL
        </Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>
          CONTINUE
        </Button>
      </Aux>
    );
  }
}

export default OrderSummary;
