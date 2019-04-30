import {takeEvery} from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga, importAuthModelSaga} from './auth';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
    yield takeEvery(actionTypes.IMPORT_AUTH_MODEL, importAuthModelSaga);
}

