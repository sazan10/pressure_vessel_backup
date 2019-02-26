import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalHead: null,
    nozzle: null,
    error: null,
    id: 0,
    projectID: null
};

const onDataSend = (state, action) => {
    console.log("insdie onDataSend");
    console.log(action);
    // state.component.push(action.component);
    return state;
};

const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const updateData = (state, action) => {
    if(action.data.component === "Cylinder") {
        for(let i = 0; i< action.data.number; i++) {
            state.component.push(action.data);
        }
    } else {
        state.component.push(action.data);
    }
    return state;
}

const reportFail = (state, action) => {
    return updateObject(state, { error: action.error})
}

const requestReport = (state, action) => {
    return updateObject(state, { projectID: action.projectID })
    
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DATA_SEND: return onDataSend(state, action);
        case actionTypes.DATA_SEND_FAIL: return onDataSendFail(state, action);
        case actionTypes.DATA_UPDATE: return updateData(state, action);
        case actionTypes.REPORT_FAIL: return reportFail(state, action);
        case actionTypes.REQUEST_REPORT: return requestReport(state, action);
        
        default:
            return state;
    }
};
export default reducer;