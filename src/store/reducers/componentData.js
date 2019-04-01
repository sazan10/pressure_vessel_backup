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
    projectID: null,
    projectName: null,
    thickness: null,
    formDialogOpen: false
};

const onDataSend = (state, action) => {
    // state.component.push(action.component);
    return updateObject(state, { thickness: action.resp });
};

const updateData1 = (state, action) => {
    // state.component.push(action.component);
   
    return updateObject(state, {height: action.height });
};
const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const updateData = (state, action) => {
    let data = null;
    let comp = action.data;
    const componentID = action.componentID;
    console.log(action.data.thickness);
    console.log("component",action.data.component);
    if (action.data.component === "Cylinder") {
        // let comp = action.data;
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
    } else if  (action.data.component === "Conical") {
        // let comp = action.data;
        const num = action.data.number;
        // const num = 1;
        try {
            comp = updateObject(comp, { thickness: action.data.thickness.toString(), componentID: action.componentID });
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
    }
    
    
    else if (action.data.component === "Nozzle") {
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
    else if(action.data.component==="Ellipsoidal Head"){
        let comp = action.data;
        try { comp = updateObject(comp, { thickness: action.data.thickness.toString(), componentID: action.componentID }) }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ]
        data.push(comp);
    }
    else if (action.data.component === "Skirt") {
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
    else if (action.data.component === "Lifting Log") {
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
    return updateObject(state, { component: data, thickness: action.data.thickness });
}

const deleteThickness = (state, action) => {
    return updateObject(state, {thickness: null});
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
    return updateObject(state, { component: data });
}


const reportFail = (state, action) => {
    return updateObject(state, { error: action.error })
}

const requestReport = (state, action) => {
    return updateObject(state, { projectID: action.projectID, projectName: action.projectName })

}

const openFormDialog = (state, action) => {
    return updateObject(state, {formDialogOpen: action.value    })
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
        case actionTypes.DATA_UPDATE1: return updateData1(state,action);
        case actionTypes.DELETE_THICKNESS: return deleteThickness(state, action);
        case actionTypes.OPEN_FORM_DIALOG: return openFormDialog(state, action);
        default:
            return state;
    }
};
export default reducer;