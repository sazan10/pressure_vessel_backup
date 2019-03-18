import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalHead: null,
    nozzle: null,
    error: null,
    id: 0,
    projectID: 13,
    thickness: null
};

const onDataSend = (state, action) => {
    console.log("insdie onDataSend");
    console.log(action);

    // state.component.push(action.component);
    return updateObject(state, { thickness: action.resp });
};

const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const updateData = (state, action) => {
    console.log("Inside update Data (Before)", state, action);
    let data = null;
    let comp = action.data;
    const componentID = state.id;
    console.log(componentID);
    if (action.data.component === "Cylinder") {
        // let comp = action.data;
        const num = action.data.number;
        // const num = 1;
        try {
            comp = updateObject(comp, { thickness: action.data.thickness.toString(), number: 1, id: componentID });
        }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ];
        // 
        for (let i = 0; i < num; i++) {
            data.push(comp);
        }
        console.log(data);
    } else if (action.data.component === "Nozzle") {
        try {
            comp = updateObject(comp, { id: componentID });
        }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ];
        data.push(action.data);
    }
    else {
        let comp = action.data;
        try { comp = updateObject(comp, { thickness: action.data.thickness.toString(), id: componentID }) }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ]
        data.push(comp);
    }
    console.log("hello fuckers");
    // console.log("Inside update Data (AFter)");
    // componentID += 1;
    // updateObject(state,{id: componentID});
    console.log("Inside update Data (AFter)");
    return updateObject(state, { component: data });
}

const reportFail = (state, action) => {
    return updateObject(state, { error: action.error })
}

const requestReport = (state, action) => {
    return updateObject(state, { projectID: action.projectID })

}
const downloadReport = (state, action) => {

}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DATA_SEND: return onDataSend(state, action);
        case actionTypes.DATA_SEND_FAIL: return onDataSendFail(state, action);
        case actionTypes.DATA_UPDATE: return updateData(state, action);
        case actionTypes.REPORT_FAIL: return reportFail(state, action);
        case actionTypes.REQUEST_REPORT: return requestReport(state, action);
        case actionTypes.DOWNLOAD_REPORT: return downloadReport(state, action);
        default:
            return state;
    }
};
export default reducer;