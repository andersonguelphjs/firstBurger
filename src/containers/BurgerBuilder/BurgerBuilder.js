import React, { Component } from "react";
import Aux from "../../hoc/_Aux/_Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";

class BurgerBuilder extends Component {
  state = {
    //ingredients: null,
    // totalPrice: 0,
    purchasable: false,
    purchasing: false,
  };
  componentDidMount() {
    //
    this.props.onInitIngredients();
  }
  updatePurchasable = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((type) => {
        return ingredients[type];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
    //this.setState({ purchasable: sum > 0 });
  };

  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const newCount = oldCount + 1;
  //   let upgradedIngredients = { ...this.state.ingredients };
  //   upgradedIngredients[type] = newCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldTotalPrice = this.state.totalPrice;
  //   const newTotalPrice = oldTotalPrice + priceAddition;
  //   this.setState({
  //     ingredients: upgradedIngredients,
  //     totalPrice: newTotalPrice,
  //   });
  //   this.updatePurchasable(upgradedIngredients);
  // };

  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const newCount = oldCount - 1;
  //   let upgradedIngredients = { ...this.state.ingredients };
  //   upgradedIngredients[type] = newCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldTotalPrice = this.state.totalPrice;
  //   const newTotalPrice = oldTotalPrice - priceDeduction;
  //   this.setState({
  //     ingredients: upgradedIngredients,
  //     totalPrice: newTotalPrice,
  //   });
  //   this.updatePurchasable(upgradedIngredients);
  // };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchased();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = { ...this.props.ings };

    let orderSummary = null;

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded </p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
            addHandler={this.props.onIngredientAdded}
            removeHandler={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchasable(this.props.ings)}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.price}
        />
      );
    }

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
const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchased: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
