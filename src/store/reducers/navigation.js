import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    title: null,
    id: null,
    stateKey: null,
    model: null
};

const clickMenu = ( state, action ) => {
    return updateObject( state, { title: action.title, id: action.id, stateKey: action.stateKey } );
};

const importModel = (state, action) => {
    return updateObject(state,{model: action.model});
}

const reducer = ( state = initialState, action ) => {
    
    switch ( action.type ) {
        case actionTypes.CLICK_MENU: return clickMenu(state, action);
        case actionTypes.IMPORT_MODEL: return importModel(state, action);
        default:
            return state;
    }
};

export default reducer;