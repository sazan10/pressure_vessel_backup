import * as actionTypes from "./actionTypes";

export const clickMenu = (title, id, stateKey) => {
   
  return {
    type: actionTypes.CLICK_MENU,
    title: title,
    id: id,
    stateKey: stateKey
  };
};

export const importModel = (title, num) => {
  return dispatch => {
    // console.log("Inside actions " + title );
  import(`../../JSONFiles/${title.replace(' ','')}Param${num}.json`)
  // import(`../../JSONFiles/CommonParam.json`)
    .then(function(response) {
      // console.log(response);
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

export const loadNext = (title) => {
  return {
    type: actionTypes.LOAD_NEXT,
    title: title,
    num: 2
  };
};

export const loadPrevious = (title) => {
  return {
    type: actionTypes.LOAD_PREVIOUS,
    num: 1
  };
};

export const updateNum = (num) => {
  return {
    type: actionTypes.UPDATE_NUM,
    num: num
  };
};
