import * as actionTypes from "./actionTypes";


export const openFormDialog = value => {
    return {
      type: actionTypes.OPEN_FORM_DIALOG,
      value: value
    };
  };

  export const showSpinner = value => {
    return {
      type: actionTypes.SHOW_SPINNER,
      value: value
    };
  };

  export const componentClicked = value => {
    return {
      type: actionTypes.COMPONENT_CLICKED,
      value: value
    };
  };