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

const reducer = ( state = initialState, action ) => {
    
    switch ( action.type ) {
        case actionTypes.CLICK_MENU: return clickMenu(state, action);
        
        default:
            return state;
    }
};

export default reducer;