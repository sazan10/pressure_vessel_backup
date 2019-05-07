import {put} from 'redux-saga/effects';
import {delay} from 'redux-saga/effects';
import base64 from "base-64";
import utf8 from "utf8";
import * as actions from '../actions/index';
import axios from '../../axios-orders';

export function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('userId');
    yield localStorage.removeItem('expirationDate');
    yield put (actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());

    let url = "/user/user-create";
    if (!action.isSignup) {
      url = "/auth/token-auth";
    }
    try{
    const response = yield axios.post(url, action.authData, { headers: action.headers });
    
    const data = response.data.data.token.split(".");
    let tokenDecoded = base64.decode(data[1]);
    tokenDecoded = utf8.decode(tokenDecoded);
    tokenDecoded = JSON.parse(tokenDecoded, null, 2);
    const expirationTime = tokenDecoded.exp - tokenDecoded.orig_iat;
    yield localStorage.setItem("token", response.data.data.token);
    yield localStorage.setItem("expirationDate", tokenDecoded.exp);
    yield localStorage.setItem("userId", tokenDecoded.username);
    yield put(actions.authSuccess(response.data.data.token, tokenDecoded.username));
    yield put(actions.checkAuthTimeout(expirationTime - 3));
    } catch(error) {
        yield put(actions.authFail(error.response));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem("token");
    if (!token) {
      yield put(actions.logout());
    } else {
      const expirationDate = yield new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        yield put(actions.logout());
      } else {
        const userId = yield localStorage.getItem("userId");
       yield put(actions.authSuccess(token, userId));
        yield put(
          actions.checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime())
          )
        );
      }
    }
}

export function* importAuthModelSaga(action) {
    const response = yield import(`../../JSONFiles/Auth/Auth`);
    yield put(actions.returnAuthModel(response.default));
    
}