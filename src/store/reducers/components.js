import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    component: [],
    cylinder: null,
    ellipsoidalhead: null,
    componentByID: null,
    nozzle: null,
    skirt: null,
    saddle: null,
    liftinglug: null,
    conical: null
}

const updateData = (state, action) => {
    let data = null;
    let comp = action.data;
    if (action.data.component === "Cylinder") {
        try {
            comp = updateObject(comp, { thickness: action.data.thickness.toString(), number: 1, componentID: action.componentID });
        }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ];
        data.push(comp);

    } else if  (action.data.component === "Conical") {
        try {
            comp = updateObject(comp, { thickness: action.data.thickness.toString(), componentID: action.componentID });
        }
        catch (err) {
            console.log(err);
        }
        data = [
            ...state.component
        ];
        data.push(comp);
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

const componentUpdate = (state, action) => {
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

const returnComponentByID = (state, action) => {
    const componentByID = {
        ...state.component[action.componentID]
    }
    return updateObject(state, {componentByID: componentByID})
}

const deleteLastComponent = (state, action) => {
    const updatedComponents = [...state.component];
    const updatedID = state.componentID - 1;
    updatedComponents.pop();
    return updateObject(state, {component: updatedComponents, componentID: updatedID   });
}

const deleteSpecificComponent = (state, action) => {
    const updatedComponents = [...state.component];
    updatedComponents[action.componentID] = null;
    return updateObject(state, {component: updatedComponents});
}

const clearComponentData = (state, action) => {
    return updateObject(state, {component:[] })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        
        case actionTypes.DATA_UPDATE: return updateData(state, action);
        case actionTypes.UPDATE_LAST_ITEM: return updateLastItem(state, action);
        case actionTypes.UPDATE_COMPONENTS: return updateComponents(state, action);
        case actionTypes.RETURN_COMPONENT_BY_ID: return returnComponentByID(state, action);
        case actionTypes.DELETE_LAST_COMPONENT: return deleteLastComponent(state, action);
        case actionTypes.DELETE_SPECIFIC_COMPONENT: return deleteSpecificComponent(state, action);
        case actionTypes.COMPONENT_UPDATE: return componentUpdate(state, action);
        case actionTypes.CLEAR_COMPONENT_DATA: return clearComponentData(state, action);
        default:
        return state;
    }
}

export default reducer;