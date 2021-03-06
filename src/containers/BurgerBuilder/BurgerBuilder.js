import React, { Component } from "react";
import Aux from "../../hoc/_Aux/_Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
  bacon: 0.8,
  salad: 1.2,
  cheese: 0.75,
  meat: 1.4,
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 0,
    purchasable: false,
    purchasing: false,
    loading: false,
  };
  componentDidMount() {
    axios
      .get("/ingredients.json")
      .then((response) => {
        console.log(response);
        this.setState({ingredients:response.data})
      })
      .catch((error) => {
        console.log(error);
      });

  }
  updatePurchasable = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((type) => {
        return ingredients[type];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  };

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount + 1;
    let upgradedIngredients = { ...this.state.ingredients };
    upgradedIngredients[type] = newCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldTotalPrice = this.state.totalPrice;
    const newTotalPrice = oldTotalPrice + priceAddition;
    this.setState({
      ingredients: upgradedIngredients,
      totalPrice: newTotalPrice,
    });
    this.updatePurchasable(upgradedIngredients);
  };

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const newCount = oldCount - 1;
    let upgradedIngredients = { ...this.state.ingredients };
    upgradedIngredients[type] = newCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldTotalPrice = this.state.totalPrice;
    const newTotalPrice = oldTotalPrice - priceDeduction;
    this.setState({
      ingredients: upgradedIngredients,
      totalPrice: newTotalPrice,
    });
    this.updatePurchasable(upgradedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice.toFixed(2),
      customer: {
        name: "mark",
        address: {
          street: "1234 my street",
          postalCode: "G7H7K9",
          country: "Canada",
        },
        email: "mark@yahoo.com",
      },
      deliveryMethod: "uber",
    };

    axios
      .post("/Orders.json", order)
      .then((response) => this.setState({ loading: false, purchasing: false }))
      .catch((error) => this.setState({ loading: false, purchasing: false }));
  };

  render() {
    const disabledInfo = { ...this.state.ingredients };

    let orderSummary = null;  

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.state.error ? <p>Ingredients can't be loaded </p> :<Spinner/>;

    if (this.state.ingredients){
      burger = (<Aux><Burger ingredients={this.state.ingredients} />
      <BuildControls
        price={this.state.totalPrice}
        addHandler={this.addIngredientHandler}
        removeHandler={this.removeIngredientHandler}
        disabled={disabledInfo}
        purchasable={this.state.purchasable}
        ordered={this.purchaseHandler}
      /></Aux>);

      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.state.totalPrice}
        /> 
      )
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    
    console.log(this.state.totalPrice);
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
