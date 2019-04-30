import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalhead: null,
    componentByID: null,
    componentClicked: false,//
    nozzle: null,
    skirt: null,
    saddle: null,
    liftinglug: null,
    conical: null,
    error: null,//
    componentID: 0,
    selectedComponentID: 0,
    projectID: null,//
    projectName: null,//
    thickness: 0.75,
    formDialogOpen: false,//
    orientation: "horizontal",//
    showSpinner: false,//
    pressure: 300,
    temperature: 300,
    shellDiameter: 72,
    view:"front"

};

const onDataSend = (state, action) => {
    // state.component.push(action.component);
    return updateObject(state, { thickness: action.resp });
};

const updateData1 = (state, action) => {
    // state.component.push(action.component);
   
    return updateObject(state, {height: action.height });
};

/////
const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const updateData = (state, action) => {
    let data = null;
    let comp = action.data;
    //const componentID = action.componentID;
    if (action.data.component === "Cylinder") {
        // let comp = action.data;
       // const num = action.data.number;
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
       // const num = action.data.number;
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
    }
    
    
    else if (action.data.component === "Nozzle") {
        try {
            comp = updateObject(comp, { componentID: action.componentID });
        }
        catch (err) {
            console.log("Nozzlw",err);
        }
        data = [
            ...state.component
        ];
        data.push(action.data);
        return updateObject(state, { component: data});
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
    else if (action.data.component === "Lifting Lug") {
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
    else if (action.data.component === "Saddle") {
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

const updateLastItem = (state, action) => {
    const component = action.componentType.toLowerCase().replace(" ","");
    return updateObject(state, {[component] : action.data});
}

//update the new components downloaded from the server after the specific project is selected .
const updateComponents = (state, action) => {

    return updateObject(state, {component : action.components});
}

const changeView = (state, action) => {

    return updateObject(state, {view : action.view});
}

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
const returnComponentByID = (state, action) => {
    const componentByID = {
        ...state.component[action.componentID]
    }
    return updateObject(state, {componentByID: componentByID})
}

const componentClicked = (state, action) => {
    return updateObject(state, {componentClicked: action.value});
}

/////////
const openFormDialog = (state, action) => {
    return updateObject(state, {formDialogOpen: action.value    })
}
const downloadReport = (state, action) => {

}

const deleteLastComponent = (state, action) => {
    const updatedComponents = [...state.component];
    const updatedID = state.componentID - 1;
    updatedComponents.pop();
    return updateObject(state, {component: updatedComponents, componentID: updatedID   });
}

const deleteSpecificComponent = (state, action) => {
    const updateComponents = [...state.component];
    updateComponents[action.id] = null;
    return updateObject(state, {component: updateComponents});
}

const updateSelectedComponentID = (state, action) => {
    return updateObject(state, {selectedComponentID: action.id});
}

///////////////////////////
const showSpinner = (state, action) => {
    return updateObject(state, {showSpinner: action.value});
}

const updatePTD = (state, action) => {
    return updateObject(state, {pressure: action.pressure,
        temperature: action.temperature,
    shellDiameter: action.shellDiameter});
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
        case actionTypes.REQUEST_NEW_REPORT: return requestNewReport(state, action);
        case actionTypes.DOWNLOAD_REPORT: return downloadReport(state, action);
        case actionTypes.DATA_UPDATE1: return updateData1(state,action);
        case actionTypes.DELETE_THICKNESS: return deleteThickness(state, action);
        case actionTypes.OPEN_FORM_DIALOG: return openFormDialog(state, action);
        case actionTypes.UPDATE_LAST_ITEM: return updateLastItem(state, action);
        case actionTypes.UPDATE_COMPONENTS: return updateComponents(state, action);
        case actionTypes.RETURN_COMPONENT_BY_ID: return returnComponentByID(state, action);
        case actionTypes.COMPONENT_CLICKED: return componentClicked(state, action);
        case actionTypes.DELETE_LAST_COMPONENT: return deleteLastComponent(state, action);
        case actionTypes.DELETE_SPECIFIC_COMPONENT: return deleteSpecificComponent(state, action);
        case actionTypes.SELECTED_COMPONENT_ID: return updateSelectedComponentID(state, action);
        case actionTypes.SHOW_SPINNER: return showSpinner(state, action);
        case actionTypes.UPDATE_P_T_D: return updatePTD(state, action);
        case actionTypes.CHANGE_VIEW: return changeView(state,action);
        default:
            return state;
    }
};
export default reducer;