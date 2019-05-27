import * as actionTypes from "./actionTypes";
import * as actions from "../actions/index";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "JWT " + localStorage.getItem("token")
// };

export const dataUpdate = (data, componentID) => {
  return {
    type: actionTypes.DATA_UPDATE,
    data: data,
    componentID: componentID
  };
};

export const onSubmitAndUpdate = (data, projectID, componentID) => {
  
    let url = null;
    let data1 = null;
    if (data.material !== undefined) {
      const mat = data.material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        spec_num: mat[0],
        type_grade: mat[1]
      };
    }
    if (data.vessel_material !== undefined) {
      const mat = data.vessel_material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        vessel_spec_num: mat[0],
        vessel_type_grade: mat[1]
      };
    }
    if (data.saddle_material !== undefined) {
      const mat = data.saddle_material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        saddle_spec_num: mat[0],
        saddle_type_grade: mat[1]
      };
    }
    url = "/api/cylinder/data";
    if (data.component === "Ellipsoidal Head") {
      data1 = {
        headParam: data,
        projectID: projectID,
        componentID: componentID
      };
      url = "/api/head/data";
    } else if (data.component === "Cylinder") {
      url = "/api/cylinder/data";
      data1 = {
        cylinderParam: data,
        projectID: projectID,
        componentID: componentID
      };
    } else if (data.component === "Nozzle") {
      url = "/api/nozzle/data";
      data={...data,"internalNozzleProjection":"0"}
      data1 = {
        nozzleParam: data,
        projectID: projectID,
        componentID: componentID
      };
    } else if (data.component === "Conical") {
      url = "/api/conicalCylinder/data";
      data1 = {
        conicalParam: data,
        projectID: projectID,
        componentID: componentID
      };
    } else if (data.component === "Skirt") {
      url = "/api/skirt/data";
      data1 = {
        skirtParam: data,
        projectID: projectID,
        componentID: componentID
      };
    } else if (data.component === "Lifting Lug") {
      url = "/api/lug/data";
      data1 = {
        lugParam: data,
        projectID: projectID,
        componentID: componentID
      };
    } else if (data.component === "Saddle") {
      url = "/api/saddle/data";
      data1 = {
        saddleParam: data,
        projectID: projectID,
        componentID: componentID
      };
    }
    return {
      type: actionTypes.ON_SUBMIT_AND_UPDATE,
      url: url,
      data1: data1,
      data: data,
      componentID: componentID,
      projectID: projectID
    }

};

//send to server to make json file of all components, so when opening project, it will be easier to load
//it in the redux store

export const deleteSpecificComponent = (projectID, componentID) => {
  return {
      type: actionTypes.DELETE_SPECIFIC_COMPONENT_IN_SERVER,
      projectID: projectID,
      componentID: componentID
  }
};

export const deleteSpecificComponentReducer = componentID => {
  return {
    type: actionTypes.DELETE_SPECIFIC_COMPONENT,
    componentID: componentID
  };
};

export const updateLastItem = (type, data) => {
  return {
    type: actionTypes.UPDATE_LAST_ITEM,
    componentType: type,
    data: data
  };
};

export const returnComponentByID = componentID => {
  return {
    type: actionTypes.RETURN_COMPONENT_BY_ID,
    componentID: componentID
  };
};

export const sendComponentID = (componentType, componentID, projectID) => {
  const url = "/api/components/";
  const data =  {
      type: componentType,
      react_component_id: componentID,
      projectID: projectID
  }
  return dispatch => {
    dispatch(axiosDataSend(data, url));
  };
};

export const sendComponentToJSON = (data, url, projectID) => {
  return dispatch => {
    const data1 = {
      schema: { ...data },
      projectID: projectID
    };
    dispatch(axiosDataSend(data1, url));
  };
};
export const axiosDataSend = (data, url) => {
  return {
      type: actionTypes.SEND_COMPONENT,
      data: data,
      url: url
  }
};

export const updateComponent = data => {
  return {
    type: actionTypes.COMPONENT_UPDATE,
    data: data
  };
};

export const updateComponents = components => {
  return {
    type: actionTypes.UPDATE_COMPONENTS,
    components: components
  };
};

//to import specific project from the server based on project name and id and after receiving response
//updating the project id, project name, components and component ID in redux state
export const importSpecificProject = projectID => {
  return {
    type: actionTypes.IMPORT_SPECIFIC_PROJECT_SAGA,
    projectID: projectID
  }
};

export const clearComponentData = () => {
  return dispatch => {
    dispatch(actions.clearComponentID());
    dispatch(clearComponentDataReducer());
  }
  
};

const clearComponentDataReducer = () => {
  return {
    type: actionTypes.CLEAR_COMPONENT_DATA
  };
}

export const deleteLastComponent = () => {
    return {
      type: actionTypes.DELETE_LAST_COMPONENT
    };
  };


