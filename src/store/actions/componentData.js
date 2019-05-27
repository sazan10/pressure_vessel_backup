import * as actionTypes from "./actionTypes";

export const onDataSendFail = error => {
  return {
    type: actionTypes.DATA_SEND_FAIL,
    error: error
  };
};

export const updateThickness = (response) => {
  return {
    type: actionTypes.UPDATE_THICKNESS,
    resp: response,
  };
};

export const updateHeight = (data, componentID, height) => {
  //onsole.log("data",data);
  return {
    type: actionTypes.UPDATE_HEIGHT,
    height: height
   
  };
};

//updating the last pressure, temperature and shell diameter values for next component so that the user does not need to change again

export const updatePTD = (pressure, temp, shellDia) => {
  return {
    type: actionTypes.UPDATE_P_T_D,
    pressure: pressure,
    temperature: temp,
    shellDiameter: shellDia
  }
};

export const updateSelectedComponentID = id => {
  return {
    type: actionTypes.SELECTED_COMPONENT_ID,
    id: id
  };
};


export const deleteThickness = () => {
  return {
    type: actionTypes.DELETE_THICKNESS
  };
};

export const updateComponentID = id => {
  return {
    type: actionTypes.ID_UPDATE,
    id: id
  };
};

export const clearComponentID = () => {
  return {
    type: actionTypes.CLEAR_COMPONENT_ID
  }
}

export const changeView = view => {
  return {
    type: actionTypes.CHANGE_VIEW,
    view: view
  };
};


