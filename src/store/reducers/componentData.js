import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    error: null,//
    componentID: 0,
    selectedComponentID: 0,
    thickness: 0.75,
    pressure: 300,
    temperature: 300,
    shellDiameter: 72

};

const updateThickness = (state, action) => {
    return updateObject(state, { thickness: action.resp });
};

const updateHeight = (state, action) => {
    return updateObject(state, {height: action.height });
};

const onDataSendFail = (state, action) => {
    return updateObject(state, { error: action.error });
};

const deleteThickness = (state, action) => {
    return updateObject(state, {thickness: null});
}
const idUpdate = (state, action) => {
    return updateObject(state, { componentID: action.id });
}

const updateSelectedComponentID = (state, action) => {
    return updateObject(state, {selectedComponentID: action.id});
}

const updatePTD = (state, action) => {
    return updateObject(state, {pressure: action.pressure,
        temperature: action.temperature,
    shellDiameter: action.shellDiameter});
}

const clearComponentID = (state, action) => {
    return updateObject(state, {componentID: 0});
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_THICKNESS: return updateThickness(state, action);
        case actionTypes.DATA_SEND_FAIL: return onDataSendFail(state, action);
        case actionTypes.ID_UPDATE: return idUpdate(state, action);
        case actionTypes.UPDATE_HEIGHT: return updateHeight(state,action);
        case actionTypes.DELETE_THICKNESS: return deleteThickness(state, action);
        case actionTypes.SELECTED_COMPONENT_ID: return updateSelectedComponentID(state, action);
        case actionTypes.UPDATE_P_T_D: return updatePTD(state, action);
        case actionTypes.CLEAR_COMPONENT_ID: return clearComponentID(state, action);
        default:
            return state;
    }
};
export default reducer;