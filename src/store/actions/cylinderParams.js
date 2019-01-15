import * as actionTypes from "./actionTypes";

export const cylinderParams1 = (data) => {
   
  return {
    type: actionTypes.CYLINDER_PARAM1,
    data: data
  };
};

export const cylinderParams2 = (data) => {
    return {
        type: actionTypes.CYLINDER_PARAM2,
        data: data
    }
}