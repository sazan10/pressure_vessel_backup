import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    title: null,
    previousTitle: null,
    id: null,
    stateKey: null,
    model: null,
    num: 1
};

const clickMenu = ( state, action ) => {
    return updateObject( state, { title: action.title, id: action.id, stateKey: action.stateKey } );
};

const importModel = (state, action) => {
    return updateObject(state,{model: action.model});
};

const loadNext = (state, action) => {
    return updateObject(state,{previousTitle: state.title, title: action.title,num: action.num});
};

const loadPrevious = (state, action) => {
    return updateObject(state, {title: state.previousTitle, num: action.num});
};

const updateNum = (state, action) => {
    return updateObject(state, {num: action.num});
}

const reducer = ( state = initialState, action ) => {
    
    switch ( action.type ) {
        case actionTypes.CLICK_MENU: return clickMenu(state, action);
        case actionTypes.IMPORT_MODEL: return importModel(state, action);
        case actionTypes.LOAD_NEXT: return loadNext(state, action);
        case actionTypes.LOAD_PREVIOUS: return loadPrevious(state, action);
        case actionTypes.UPDATE_NUM: return updateNum(state, action);
        default:
            return state;
    }
};

export default reducer;