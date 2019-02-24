import axios from "../../axios-orders";
import base64 from "base-64";
import utf8 from "utf8";
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
  
  let url = "/refresh-token-auth";
  
  return dispatch => {
    var headers = {
      "Content-Type": "application/json",
      Authorization: "JWT" + token
    };

    const data = {
      token: token
    };

    dispatch(axiosAuth(data, url, headers));
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      // console.log("Logging out with timeout");
      //dispatch(logout());
      dispatch(authWithToken());
    }, expirationTime * 1000);
  };
};

export const auth = (data, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    // console.log(data);
    let url = "/api/users";

    if (!isSignup) {
      url = "/auth/token-auth";
    }
    const headers = {
      "Content-Type": "application/json"
    };
    dispatch(axiosAuth(data, url, headers));
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const axiosAuth = (authData, url, headers) => {
  return dispatch => {
    // console.log("Reached yeah");
    axios
      .post(url, authData, { headers: headers })
      .then(response => {
        console.log(response);

        const data = response.data.data.token.split(".");
        // console.log(data);

        let tokenDecoded = base64.decode(data[1]);
        tokenDecoded = utf8.decode(tokenDecoded);
        tokenDecoded = JSON.parse(tokenDecoded, null, 2);
        // console.log(response.data.data.token);
        const expirationTime = tokenDecoded.exp - tokenDecoded.orig_iat;
        // console.log(expirationTime);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("expirationDate", tokenDecoded.exp);
        localStorage.setItem("userId", tokenDecoded.username);
        dispatch(authSuccess(response.data.data.token, tokenDecoded.username));
        dispatch(checkAuthTimeout(expirationTime - 3));
      })
      .catch(err => {
        dispatch(authFail(err.response));
      });
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
