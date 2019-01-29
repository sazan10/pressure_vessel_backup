import * as actionTypes from "./actionTypes";

export const clickMenu = (title, id, stateKey) => {
   
  return {
    type: actionTypes.CLICK_MENU,
    title: title,
    id: id,
    stateKey: stateKey
  };
};

export const importModel = (title, id, stateKey) => {
  return dispatch => {
    console.log("Inside actions " + title );
  import(`../../JSONFiles/${title.replace(' ','')}Param2.json`)
    .then(function(response) {
      console.log(response);
      dispatch(returnModel(response.default));
    });
  };
};

export const returnModel = (model) => {
  return {
    type: actionTypes.IMPORT_MODEL,
    model: model
  };
};
