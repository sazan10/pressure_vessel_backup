import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    showSpinner: false,//
    formDialogOpen: false,//
    componentClicked: false,//
}

const componentClicked = (state, action) => {
    return updateObject(state, {componentClicked: action.value});
}

const openFormDialog = (state, action) => {
    return updateObject(state, {formDialogOpen: action.value    })
}

const showSpinner = (state, action) => {
    return updateObject(state, {showSpinner: action.value});
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_SPINNER: return showSpinner(state, action);
        case actionTypes.COMPONENT_CLICKED: return componentClicked(state, action);
        case actionTypes.OPEN_FORM_DIALOG: return openFormDialog(state, action);
        default:
            return state;
    }
};

export default reducer;