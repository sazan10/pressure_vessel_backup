import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";

const headers = {
  "Content-Type": "application/json",
  Authorization: "JWT " + localStorage.getItem("token")
};

export const onDataSendFail = error => {
  return {
    type: actionTypes.DATA_SEND_FAIL,
    error: error
  };
};

export const onDataSendTo = (response, data) => {
  return {
    type: actionTypes.DATA_SEND,
    resp: response,
    component: data
  };
};

export const dataUpdate1 = (data, componentID, height1) => {
  //onsole.log("data",data);
  return {
    type: actionTypes.DATA_UPDATE1,
    data: data,
    height: height1,
    componentID: componentID
  };
};

export const dataUpdate = (data, componentID) => {
  return {
    type: actionTypes.DATA_UPDATE,
    data: data,
    componentID: componentID
  };
};

export const componentClicked = value => {
  return {
    type: actionTypes.COMPONENT_CLICKED,
    value: value
  };
};

export const onSubmitAndUpdate = (data, id, componentID) => {
  return dispatch => {
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
    console.log("it should hit", data.component, id);
    if (data.component === "Ellipsoidal Head") {
      data1 = {
        headParam: data,
        projectID: id,
        componentID: componentID
      };
      url = "/api/head/data";
    } else if (data.component === "Cylinder") {
      url = "/api/cylinder/data";
      data1 = {
        cylinderParam: data,
        projectID: id,
        componentID: componentID
      };
    } else if (data.component === "Nozzle") {
      url = "/api/nozzle/data";
      data1 = {
        nozzleParam: data,
        projectID: id,
        componentID: componentID
      };
    } else if (data.component === "Conical") {
      url = "/api/conicalCylinder/data";
      data1 = {
        conicalParam: data,
        projectID: id,
        componentID: componentID
      };
    } else if (data.component === "Skirt") {
      url = "/api/skirt/data";
      data1 = {
        skirtParam: data,
        projectID: id,
        componentID: componentID
      };
    } else if (data.component === "Lifting Lug") {
      url = "/api/lug/data";
      data1 = {
        lugParam: data,
        projectID: id,
        componentID: componentID
      };
    } else if (data.component === "Saddle") {
      url = "/api/saddle/data";
      data1 = {
        saddleParam: data,
        projectID: id,
        componentID: componentID
      };
    }
    console.log("Before sending to server of component " + data.component);
    axios
      .post(url, data1, {
        headers: headers
      })
      .then(response => {
        console.log("after sending to server of component ", data.component, response);
        if (
          response.data.thickness !== null ||
          response.data.thicknessResponse != null
        ) {
          let data1 = null;
          if (
            response.data.thickness !== undefined &&
            !response.data.thicknessResponse
          ) {
              data1 = {
                ...data,
                ...{
                  thickness:
                    data.thickness < response.data.thickness
                      ? roundThickness(response.data.thickness)
                      : roundThickness(data.thickness),
                  value: response.data
                }
              };

              dispatch(updatePTD(data.ip, data.temp1, data.sd));
            
          } else {
            data1 = {
              ...data,
              ...{
                // thickness:response.data.thicknessResponse,
                value: response.data
              }
            };
          }
          console.log("Data to be added",data1);
          dispatch(updateLastItem(data.component, data1));
          console.log("Updated last item");
          if (data.componentID < componentID) {
            //ask for server to save the values in database without doing calculations
            dispatch(updateComponent(data1));
            const url = "/api/state/update";
            dispatch(sendComponent(data1, url, id));
          } else {
            if (data1.component === "Cylinder") {
              for (let i = 0; i < data1.number; i++) {
                dispatch(dataUpdate(data1, componentID));
                componentID = componentID + 1;
                dispatch(updateComponentID(componentID));
              }
            } else {
              console.log("to add component except cylinder");
              dispatch(dataUpdate(data1, componentID));
              console.log(" added component except cylinder");
              componentID = componentID + 1;
              dispatch(updateComponentID(componentID));
            }
            const url = "/api/state/write";
            dispatch(sendComponent(data1, url, id));
          }
        } else {
          dispatch(onDataSendFail("No thickness received"));
        }
      })
      .catch(err => {
        dispatch(onDataSendFail(err));
      });
  };
};

//send to server to make json file of all components, so when opening project, it will be easier to load
//it in the redux store
const sendComponent = (data, url, id) => {
  return dispatch => {
    const schema = {
      schema: { ...data },
      projectID: id
    };
    dispatch(axiosDataSend(schema, url));
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

export const showSpinner = value => {
  return {
    type: actionTypes.SHOW_SPINNER,
    value: value
  };
};

const roundThickness = thickness => {
  let t = Math.floor(thickness * 10000);
  const round = Math.ceil(t / 125);
  t = (round * 125) / 10000;
  return t;
};

export const deleteLastComponent = () => {
  return {
    type: actionTypes.DELETE_LAST_COMPONENT
  };
};

export const deleteSpecificComponent = (projectID, componentID) => {
  console.log("in delete specific component", componentID);
  const url = "api/state/delete";
  const schema = {
    schema: { 
      componentID: componentID
    },
    projectID: projectID
  };
  return dispatch => {
  axios.post(url,schema,{headers: headers} ).then(response => {
      console.log("after delete",response);
    
      dispatch(deleteSpecificComponentReducer(componentID));
    }).catch(err => {
      console.log(err);
    });
}
  // return dispatch => {
  //       dispatch(deleteSpecificComponentReducer(1));
  //     };
};

const deleteSpecificComponentReducer = id => {
  return {
    type: actionTypes.DELETE_SPECIFIC_COMPONENT,
    id: id
  };
};

export const updateSelectedComponentID = id => {
  return {
    type: actionTypes.SELECTED_COMPONENT_ID,
    id: id
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

export const openFormDialog = value => {
  return {
    type: actionTypes.OPEN_FORM_DIALOG,
    value: value
  };
};

export const deleteThickness = () => {
  return {
    type: actionTypes.DELETE_THICKNESS
  };
};

export const sendComponentID = (componentType, componentID, projectID) => {
  return dispatch => {
    const data = {
      type: componentType,
      react_component_id: componentID,
      projectID: projectID
    };
    const url = "/api/components/";
    dispatch(axiosDataSend(data, url));
  };
};

export const requestProjectID = (projectName, orientation) => {
  return dispatch => {
    dispatch(requestReport(projectName, orientation,actionTypes.REQUEST_REPORT));
  };
};
export const requestNewProjectID = (projectName, orientation) => {
  return dispatch => {
    dispatch(requestReport(projectName, orientation,actionTypes.REQUEST_NEW_REPORT));
  };
};

export const updateComponentID = id => {
  return {
    type: actionTypes.ID_UPDATE,
    id: id
  };
};

export const updateComponent = data => {
  return {
    type: actionTypes.COMPONENT_UPDATE,
    data: data
  };
};

//to import specific project from the server based on project name and id and after receiving response
//updating the project id, project name, components and component ID in redux state
export const importSpecificProject = id => {
  // let url = `report/reports/${id}/project/`;
  console.log(headers);
  const url = "api/state/open";
  let req=actionTypes.REQUEST_REPORT;
  return dispatch => {
    axios
      .get(
        url,
        {
          params: {
            projectID: id
          },
          headers: headers
        }
      )
      .then(response => {
        console.log(response);
        
        dispatch(
          onReportIDReceive(
            response.data.projectID,
            response.data.projectName,
            response.data.orientation,
            req
          )
        );
        dispatch(updateComponentID(response.data.components.length));
        dispatch(updateComponents(response.data.components));
      });
  };
};

export const updateComponents = components => {
  return {
    type: actionTypes.UPDATE_COMPONENTS,
    components: components
  };
};

export const axiosDataSend = (data, url) => {
  return dispatch => {
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        console.log("response from backend",response.data);
        // dispatch(onDataSendTo(response.data.thickness, data));
        // console.log("after dispatch");
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
  };
};

//////REPORT

export const requestReport = (projectName, orientation,requestType) => {
  return dispatch => {
    const url = "/report/reports/";
    const projectName1 = Math.random();
    const data = {
      report_type: "vessel",
      projectName: projectName,
      orientation: orientation
    };
    return dispatch(axiosReport(data, url,requestType));
  };
};

export const onReportIDReceive = (projectID, projectName, orientation,requestType) => {
  console.log(projectName);
  return {
    type: requestType,
    projectID: projectID,
    projectName: projectName,
    orientation: orientation
  };
};

export const axiosReport = (data, url,requestType) => {
  return dispatch => {
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        dispatch(
          onReportIDReceive(
            response.data.id,
            data.projectName,
            data.orientation,
            requestType
          )
        );
      })
      .catch(err => {
        dispatch(requestFail(err.response));
      });
  };
};

export const requestFail = error => {
  console.log(error);
  return {
    type: actionTypes.REPORT_FAIL,
    error: error
  };
};

export const downloadReport = id => {
  return dispatch => {
    const url = "/report/generate";
    const data = {
      projectID: id
    };
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        let pdfWindow = window.open("/");
        try {
          pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
              encodeURI(response.data) +
              "'></iframe>"
          );
        } catch (Exception) {
          window.alert("PLEASE ALLOW POP UPS!!!");
        }
        dispatch(hideSpinner(false));
      });
  };
};

const hideSpinner = value => {
  return {
    type: actionTypes.SHOW_SPINNER,
    value: value
  };
};

const _base64ToArrayBuffer = base64 => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};
