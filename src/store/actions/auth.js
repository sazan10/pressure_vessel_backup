import * as actionTypes from "./actionTypes";

const headers = {
  "Content-Type": "application/json"
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const importAuthModel = (isSignup) => {
  return {
    type: actionTypes.IMPORT_AUTH_MODEL
  }
};

export const returnAuthModel = (model) => {
  return {
    type: actionTypes.LOAD_AUTH_MODEL,
    model: model
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_INITIATE_LOGOUT
  };
};

export const logoutSucceed = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }

}

export const checkAuthTimeout = expirationTime => {
  return {
    type: actionTypes.AUTH_CHECK_TIMEOUT,
    expirationTime: expirationTime
  };
};

export const auth = (data, isSignup) => {
  return {
    type: actionTypes.AUTH_USER,
    authData: data,
    isSignup: isSignup,
    headers: headers
  }
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return {
    type: actionTypes.AUTH_CHECK_STATE
  }
};
