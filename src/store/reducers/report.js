import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    error: null,
    id: null
};

const reportFail = (state, action) => {
    return updateObject(state, { error: action.error})
}

const requestReport = (state, action) => {
    return updateObject(state, { id: action.id })
    
}

const downloadReport = (state, action) => {
    
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.REPORT_FAIL: return reportFail(state, action);
        case actionTypes.REQUEST_REPORT: return requestReport(state, action);
        default:
            return state;
    }
};

export default reducer;