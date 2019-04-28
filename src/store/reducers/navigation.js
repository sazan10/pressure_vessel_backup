import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';


const initialState = {
    title: null,
    previousTitle: null,
    id: null,
    stateKey: null,
    componentModel: null,
    formModel: null,
    num: 1,
    new: false,
    componentTree: false,
    projects: []
};

const clickMenu = ( state, action ) => {
    return updateObject( state, { title: action.title, id: action.id, stateKey: action.stateKey } );
};

const importComponentModel = (state, action) => {
    console.log("inside import contentmodel",action.model)
    return updateObject(state,{componentModel: action.model, new: true});
};

const importFormModel = (state, action) => {
    return updateObject(state,{formModel: action.model, new: true});
};

const disableNew = (state, actions) => {
    return updateObject(state, {new: false});
}

const loadNext = (state, action) => {
    return updateObject(state,{previousTitle: state.title, title: action.title,num: action.num});
};

const loadPrevious = (state, action) => {
    return updateObject(state, {title: state.previousTitle, num: action.num});
};

const updateNum = (state, action) => {
    return updateObject(state, {num: action.num});
}

const loadComponentTree = (state, action) => {
    return updateObject(state, {componentTree : action.value});
}

const importProjects = (state, action) => {
    return updateObject(state, { projects: action.projects});
}

const updateTitle= (state, action) => {
    return updateObject(state, { title: action.title});
}
const reducer = ( state = initialState, action ) => {
    
    switch ( action.type ) {
        case actionTypes.CLICK_MENU: return clickMenu(state, action);
        case actionTypes.DISABLE_NEW: return disableNew(state, action);
        case actionTypes.IMPORT_COMPONENT_MODEL: return importComponentModel(state, action);
        case actionTypes.IMPORT_FORM_MODEL: return importFormModel(state, action);
        case actionTypes.LOAD_NEXT: return loadNext(state, action);
        case actionTypes.LOAD_PREVIOUS: return loadPrevious(state, action);
        case actionTypes.UPDATE_NUM: return updateNum(state, action);
        case actionTypes.LOAD_COMPONENT_TREE: return loadComponentTree(state, action);
        case actionTypes.IMPORT_PROJECTS: return importProjects(state, action);
        case actionTypes.UPDATE_TITLE: return updateTitle(state,action);
        default:
            return state;
    }
};

export default reducer;