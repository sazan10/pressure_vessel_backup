import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    component: null,
    cylinder: null,
    ellipsoidalHead: null,
    nozzle: null,
    error: null,
    id: 0
};

const onDataSend = (state, action) => {
    console.log("insdie onDataSend");
    // if (action.component.component === "cylinder") {
        return updateObject(state, { component: action.component });
        
    // }
    // return updateObject(state, { component: action.component });
};

const onDataSendFail = (state, action) => {
    // return updateObject(state, { error: action.error });
    return updateObject(state, { id:1 });
};

// const onComponentAdd = (state, action) => {
    
// }


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DATA_SEND: return onDataSend(state, action);
        case actionTypes.DATA_SEND_FAIL: return onDataSendFail(state, action);
        default:
            return state;
    }
};
export default reducer;