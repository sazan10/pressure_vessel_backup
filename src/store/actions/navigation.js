import * as actionTypes from "./actionTypes";

export const clickMenu = (title, id, stateKey) => {
   
  return {
    type: actionTypes.CLICK_MENU,
    title: title,
    id: id,
    stateKey: stateKey
  };
};
