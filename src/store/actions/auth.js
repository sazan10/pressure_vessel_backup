import axios from "../../axios-orders";

import * as actionTypes from "./actionTypes";

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

export const logout = () => {
  console.log("Logging out");
  // localStorage.removeItem('token');
  // localStorage.removeItem('expirationDate');
  // localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const authWithToken = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem('userId');
//   console.log(token);

  // const data = null;
  const data = {
    token: token
  };
  let url = "http://192.168.1.9:3000/refresh-token-auth/";
  // let url = "http://192.168.10.94:3000/api/data/";

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'JWT' + token 
  }

  return dispatch => {
    axios.post(url, data, {headers: headers}).then(response => {
      console.log(response.data.token);
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 1000
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("expirationDate", expirationDate);
      localStorage.setItem("userId", response.data.user.username);
      dispatch(authSuccess(response.token,response.data.user.username));
      dispatch(checkAuthTimeout(response.data.expiresIn));
    });
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      console.log("Logging out with timeout");
      //dispatch(logout());
      dispatch(authWithToken());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      username: email,
      password: password,
      returnSecureToken: true
    };
    let url = "http://192.168.1.9:3000/token-auth/";

    if (!isSignup) {
      url = "http://192.168.1.9:3000/token-auth/";
    }
    axios
      .post(url, authData)
      .then(response => {
        console.log(response);
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userId", response.data.user.username);
        dispatch(authSuccess(response.data.token, response.data.user.username));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
