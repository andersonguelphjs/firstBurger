import * as actionTypes from "../actions/actionTypes";
import { updatedObject } from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirect: "/",
};
const authStart = (state, action) => {
  return updatedObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
  return updatedObject(state, {
    token: action.IdToken,
    userId: action.userId,
    error: null,
    loading: false,
  });
};
const authFailed = (state, action) => {
  return updatedObject(state, {
    // token: null,
    // userId: null,
    error: action.error,
    loading: false,
  });
};
const logout = (state, action) => {
  return updatedObject(state, {
    token: null,
    userId: null,
  });
};

const setAuthRedirectPath = (state, action) => {
  return updatedObject(state, {
    authRedirect: action.path,
  });
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAILED:
      return authFailed(state, action);
    case actionTypes.AUTH_LOGOUT:
      return logout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
