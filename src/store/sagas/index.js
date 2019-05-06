import {takeEvery} from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {logoutSaga, checkAuthTimeoutSaga, authUserSaga, authCheckStateSaga, importAuthModelSaga} from './auth';
import{importModelSaga, importNewFormSaga, importOpenFormSaga} from './navigation';
import {requestNewProjectSaga, downloadReportSaga} from './projectData';
import {deleteSpecificComponentSaga, sendComponentIDsaga, axiosDataSendSaga, importSpecificProjectSaga, onSubmitAndUpdateSaga} from './components';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga);
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
    yield takeEvery(actionTypes.IMPORT_AUTH_MODEL, importAuthModelSaga); 
}

export function* watchNavigation() {
    yield takeEvery(actionTypes.IMPORT_MODEL, importModelSaga);
    yield takeEvery(actionTypes.IMPORT_NEW_MODEL, importNewFormSaga);
    yield takeEvery(actionTypes.IMPORT_OPEN_MODEL, importOpenFormSaga);
}

export function* watchProjectData() {
    yield takeEvery(actionTypes.REQUEST_NEW_PROJECT, requestNewProjectSaga);
    yield takeEvery(actionTypes.DOWNLOAD_REPORT, downloadReportSaga);
}

export function* watchComponentData() {
    
}

export function* watchComponents() {
    yield takeEvery(actionTypes.DELETE_SPECIFIC_COMPONENT_IN_SERVER, deleteSpecificComponentSaga);
    yield takeEvery(actionTypes.SEND_COMPONENT, axiosDataSendSaga);
    yield takeEvery(actionTypes.IMPORT_SPECIFIC_PROJECT_SAGA, importSpecificProjectSaga);
    yield takeEvery(actionTypes.ON_SUBMIT_AND_UPDATE, onSubmitAndUpdateSaga)
}

