import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    cylinders: [],
    param1: null,
    id: -1
};

const cylinderParams1 = ( state, action ) => {
    const id = state.id + 1;
    console.log(state);
    return updateObject( state, { param1: action.data, id: id } );
};

const cylinderParams2 = ( state, action ) => {
    const a = updateObject(state.param1, action.data);
    console.log(a);
    return updateObject( state, { data: action.data } );
};

const reducer = ( state = initialState, action ) => {
    
    switch ( action.type ) {
        case actionTypes.CYLINDER_PARAM1: return cylinderParams1(state, action);
        case actionTypes.CYLINDER_PARAM2: return cylinderParams2(state, action);
        default:
            return state;
    }
};

export default reducer;