import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/builder',
    isAuthenticated: true,
    model: null
};

const authStart = ( state, action ) => {
    return updateObject( state, { error: null, loading: true } );
};

const authSuccess = (state, action) => {
    // console.log("Success Auth");
    return updateObject( state, { 
        token: action.idToken,
        userId: action.userId,
        isAuthenticated: true,
     });
};

const authFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false,
        isAuthenticated: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, { token: null, userId: null, isAuthenticated: false });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}

const loadModel = (state, action) => {
    console.log(action.model);
    return updateObject(state,{model: action.model});
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        case actionTypes.LOAD_AUTH_MODEL: return loadModel(state, action);
        default:
            return state;
    }
};

export default reducer;