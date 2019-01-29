import axios from "../../axios-orders";
import base64 from 'base-64';
import utf8 from 'utf8';
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
        
        const data = response.data.token.split('.');
        console.log(data);

        let tokenDecoded = base64.decode(data[1]);
        tokenDecoded = utf8.decode(tokenDecoded);
        tokenDecoded = JSON.parse(tokenDecoded, null, 2);

        const expirationTime = tokenDecoded.exp - tokenDecoded.orig_iat;
        console.log(expirationTime);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expirationDate", tokenDecoded.exp);
        localStorage.setItem("userId", tokenDecoded.username);
        dispatch(authSuccess(response.data.token, tokenDecoded.username));
        dispatch(checkAuthTimeout(expirationTime));
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
    let url = "http://192.168.1.12:3000/token-auth/";

    if (!isSignup) {
      url = "http://192.168.1.12:3000/token-auth/";
    }

    var headers = {
      'Content-Type': 'application/json',
    }
    axios
      .post(url, authData,{headers: headers})
      .then(response => {
        console.log(response);

        const data = response.data.token.split('.');
        console.log(data);

        let tokenDecoded = base64.decode(data[1]);
        tokenDecoded = utf8.decode(tokenDecoded);
        tokenDecoded = JSON.parse(tokenDecoded, null, 2);

        const expirationTime = tokenDecoded.exp - tokenDecoded.orig_iat;
        console.log(expirationTime);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("expirationDate", tokenDecoded.exp);
        localStorage.setItem("userId", tokenDecoded.username);
        dispatch(authSuccess(response.data.token, tokenDecoded.username));
        dispatch(checkAuthTimeout(expirationTime));
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
