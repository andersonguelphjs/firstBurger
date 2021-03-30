import * as actionTypes from "../actions/actionTypes";
import { updatedObject } from "../../shared/utility";

const intitialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const purchaseInit = (state, action) => {
  return updatedObject(state, { purchased: false });
};
const purchaseBurgerStart = (state, action) => {
  return updatedObject(state, { loading: true });
};
const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updatedObject(action.orderData, { id: action.orderId });
  return updatedObject(state, {
    orders: {
      ...state.orders.concat(newOrder),
    },
    loading: false,
    purchased: true,
  });
};
const purchaseBurgerFailed = (state, action) => {
  return updatedObject(state, { loading: false, purchased: true });
};
const fetchOrdersStart = (state, action) => {
  return updatedObject(state, { loading: true });
};
const fetchOrdersSuccess = (state, action) => {
  return updatedObject(state, { orders: action.orders, loading: false });
};
const fetchOrdersFailed = (state, action) => {
  return updatedObject(state, { loading: false });
};

const reducer = (state = intitialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state, action);

    case actionTypes.PURCHASE_BURGER_START:
      return purchaseBurgerStart(state, action);

    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchaseBurgerSuccess;

    case actionTypes.PURCHASE_BURGER_FAILED:
      return purchaseBurgerFailed(state, action);

    case actionTypes.FETCH_ORDERS_START:
      return fetchOrdersStart(state, action);

    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);

    case actionTypes.FETCH_ORDERS_FAILED:
      return fetchOrdersFailed(state, action);

    default:
      return state;
  }
};

export default reducer;
