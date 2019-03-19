import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';
import { sendComponentID } from '../actions';

const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalHead: null,
    nozzle: null,
    error: null,
    componentID: 0,
    projectID: 13,
    thickness: null
};

const onDataSend = (state, action) => {
    console.log("inside onDataSend");
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
    const componentID = action.componentID;
    console.log(componentID);
    console.log(action);
    if (action.data.component === "Cylinder") {
        // let comp = action.data;
        console.log("CYLINDER");
        const num = action.data.number;
        // const num = 1;
        try {
            comp = updateObject(comp, { thickness: action.data.thickness.toString(), number: 1, componentID: action.componentID });
        }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ];
        // 
        // for (let i = 0; i < num; i++) {
        data.push(comp);
        // }
        console.log(data);
    } else if (action.data.component === "Nozzle") {
        console.log("NOZZLE");
        try {
            comp = updateObject(comp, { componentID: action.componentID });
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
        console.log("ELIPSOIDAL HEAD");
        let comp = action.data;
        try { comp = updateObject(comp, { thickness: action.data.thickness.toString(), componentID: action.componentID }) }
        catch (err) {
            console.log(err);
        }
        console.log("aa", comp, data, state.component);
        data = [
            ...state.component
        ]
        console.log("aaaa");
        data.push(comp);
        console.log("aaaaaa");
    }
    console.log("hello fuckers");
    console.log(componentID);
    return updateObject(state, { component: data });
}

const idUpdate = (state, action) => {
    return updateObject(state, { componentID: action.id });
}

const componentUpdate = (state, action) => {
    // console.log(action.data.componentID);
    const data = [
        ...state.component
    ];
    data[action.data.componentID] = action.data;
    console.log(data);
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
        case actionTypes.ID_UPDATE: return idUpdate(state, action);
        case actionTypes.COMPONENT_UPDATE: return componentUpdate(state, action);
        case actionTypes.REPORT_FAIL: return reportFail(state, action);
        case actionTypes.REQUEST_REPORT: return requestReport(state, action);
        case actionTypes.DOWNLOAD_REPORT: return downloadReport(state, action);
        default:
            return state;
    }
};
export default reducer;