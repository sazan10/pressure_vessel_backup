import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    error: null,
    id: null
};

///////
const reportFail = (state, action) => {
    console.log(action.error.data.errors.msg);
    const error = action.error.data.errors.msg.toString();
    console.log(error);
    return updateObject(state, { error: action.error })
}

///////
const requestReport = (state, action) => {
    return updateObject(state, { projectID: action.projectID, projectName: action.projectName, orientation: action.orientation })

}
const requestNewReport = (state, action) => {
    return updateObject(state, { componentID:0,component:[],projectID: action.projectID, projectName: action.projectName, orientation: action.orientation })

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