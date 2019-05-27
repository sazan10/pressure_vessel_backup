import * as actionTypes from "./actionTypes";

export const clickMenu = (title, id, stateKey) => {
  return {
    type: actionTypes.CLICK_MENU,
    title: title,
    id: id,
    stateKey: stateKey
  };
};

export const disableNew = () => {
  return {
    type: actionTypes.DISABLE_NEW
  };
};

export const importComponentModel = (title, num) => {
  return {
    type: actionTypes.IMPORT_MODEL,
    title: title,
  }
};

export const updateTitle=(title)=>{
  return {
    type: actionTypes.UPDATE_TITLE,
    title:title
  };
}


export const importForm = title => {
  if (title === "New") {
    return {
      type: actionTypes.IMPORT_NEW_MODEL,
      title: title
    }
  } else if (title === "Open") {
    return {
      type: actionTypes.IMPORT_OPEN_MODEL,
      title: title
    }
  }
};
 
//to update the state for vessel projects to appear when OPEN is clicked
export const importProjects = (projects) => {
  return {
    type: actionTypes.IMPORT_PROJECTS,
    projects: projects
  }
}

export const returnForm = model => {
  return {
    type: actionTypes.LOAD_FORM_MODEL,
    model: model
  };
};

export const returnModel = model => {
  return {
    type: actionTypes.IMPORT_COMPONENT_MODEL,
    model: model
  };
};

export const displayComponentTree = value => {
  return {
    type: actionTypes.LOAD_COMPONENT_TREE,
    value: value
  };
};
