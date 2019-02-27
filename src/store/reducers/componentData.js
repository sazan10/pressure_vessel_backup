import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalHead: null,
    nozzle: null,
    error: null,
    id: 0,
    projectID: null,
    thickness: null
};

const onDataSend = (state, action) => {
    console.log("insdie onDataSend");
    console.log(action);
    
    // state.component.push(action.component);
    return updateObject(state, {thickness: action.resp});
};

const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const updateData = (state, action) => {
    if(action.data.component === "Cylinder") {
        let comp = action.data;
        const num = action.data.number;
      //  comp = updateObject(comp, {thickness: state.thickness.toString(), number: 1});
        for(let i = 0; i< num; i++) {
            state.component.push(comp);
        }
    } else if(action.data.component === "Nozzle") {
        state.component.push(action.data);
    }
    else {
        let comp = action.data;
       // comp = updateObject(comp, {thickness: state.thickness.toString()})
        state.component.push(comp);
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