import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";

const headers = {
  "Content-Type": "application/json",
  "Authorization": "JWT " + localStorage.getItem("token")
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

export const dataUpdate1 = (data, componentID,height1) => {
//onsole.log("data",data);
  return {
    type: actionTypes.DATA_UPDATE1,
    data : data,
    height:height1,
    componentID: componentID

  }
}

export const dataUpdate = (data, componentID) => {
    return {
      type: actionTypes.DATA_UPDATE,
      data : data,
      componentID: componentID
    }
  }


export const componentClicked = (value) => {
  return {
    type: actionTypes.COMPONENT_CLICKED,
    value: value
  }
}

export const onSubmitAndUpdate = (data, id, componentID) => {
  return dispatch => {
    let url = null;
    let data1 = null
    if (data.material !== undefined) {
      const mat = data.material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        spec_num: mat[0],
        type_grade: mat[1],
      }
    }
    if (data.vessel_material !== undefined) {
      const mat = data.vessel_material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        vessel_spec_num: mat[0],
        vessel_type_grade: mat[1],
      }
    }
    if (data.saddle_material !== undefined) {
      const mat = data.saddle_material.split(" ");
      // data.length = data.length * 12;
      data = {
        ...data,
        saddle_spec_num: mat[0],
        saddle_type_grade: mat[1],
      }
    }
    url = "/api/cylinder/data";
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
    }
    else if (data.component === "Conical") {
      url = "/api/conicalCylinder/data";
      data1 = {
        conicalParam: data,
        projectID: id,
        componentID: componentID
      };

    }
    else if (data.component === "Skirt") {
      url = "/api/skirt/data";
      data1 = {
        skirtParam: data,
        projectID: id,
        componentID:componentID
      };
    }
    else if (data.component === "Lifting Lug") {
      url = "/api/lug/data";
      data1 = {
        lugParam: data,
        projectID: id,
        componentID:componentID
      };
    }
    else if (data.component === "Saddle") {
      url = "/api/saddle/data";
      data1 = {
        saddleParam: data,
        projectID: id,
        componentID:componentID
      };
    }
    axios
      .post(url, data1, {
        headers: headers
      })
      .then(response => {
        if (response.data.thicknesss !== null || response.data.thicknessResponse!=null) {
          let data1=null;
          if(response.data.thickness!==undefined && ! response.data.thicknessResponse){
          data1 = {
            ...data,
            ...{
              thickness: roundThickness(response.data.thickness),
              value: response.data
            }
          };
        }
        else {
          data1 = {
            ...data,
            ...{
             // thickness:response.data.thicknessResponse,
              value: response.data
            }
          };
        }
          dispatch(updateLastItem(data.component, data1));
          if (data.componentID < componentID) {
            dispatch(updateComponent(data1));
          } else {
            if (data1.component === "Cylinder") {
              for (let i = 0; i < data1.number; i++) {
                dispatch(dataUpdate(data1, componentID));
                componentID = componentID + 1;
                dispatch(updateComponentID(componentID));
                
              }
            } else {
              dispatch(dataUpdate(data1, componentID));
              componentID = componentID + 1;
              dispatch(updateComponentID(componentID));
            }
          }
         // dispatch(sendComponent(data1)); 

        } else {
          dispatch(onDataSendFail("No thickness received"));
        }
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
  }
}

//send to server to make json file of all components, so when opening project, it will be easier to load 
//it in the redux store
const sendComponent = (data) => {
  return dispatch => {
    const url = '/api/state/write'
    dispatch(axiosDataSend(data, url));
}
}



const roundThickness = (thickness) =>{
  let t = Math.floor(thickness * 10000);
  const round = Math.floor(t / 125);
  t = (round * 125) / 10000;
  return t;

}

export const deleteLastComponent = () => {
  return {
    type: actionTypes.DELETE_LAST_COMPONENT
  }
}

export const deleteSpecificComponent = () => {
  return {
    type: actionTypes.DELETE_SPECIFIC_COMPONENT,
  }
}

export const updateSelectedComponentID = (id) => {
  return {
    type: actionTypes.SELECTED_COMPONENT_ID,
    id: id
  }
}

export const updateLastItem = (type, data) => {
  return {
    type: actionTypes.UPDATE_LAST_ITEM,
    componentType: type,
    data: data
  }
}

export const returnComponentByID = (componentID) => {
  return {
    type: actionTypes.RETURN_COMPONENT_BY_ID,
    componentID: componentID
  }
}

export const openFormDialog = (value) => {
  return {
    type: actionTypes.OPEN_FORM_DIALOG,
    value: value
  }
}

export const deleteThickness = () => {
  return {
    type: actionTypes.DELETE_THICKNESS
  }
}



export const sendComponentID = (componentType, componentID, projectID) => {

  return dispatch => {
    const data = {
      type: componentType,
      react_component_id: componentID,
      projectID: projectID
    };
    const url = '/api/components/'
    dispatch(axiosDataSend(data, url));
  }
}

export const requestProjectID = (projectName, orientation) => {
  return dispatch => {
    dispatch(requestReport(projectName, orientation));
  }
}

export const updateComponentID = (id) => {
  return {
    type: actionTypes.ID_UPDATE,
    id: id
  }
}

export const updateComponent = (data) => {
  return {
    type: actionTypes.COMPONENT_UPDATE,
    data: data
  }
}

//to import specific project from the server based on project name and id and after receiving response
//updating the project id, project name, components and component ID in redux state
export const importSpecificProject = (id) => {
  let url = `report/reports/${id}/project/`;
  
  return dispatch => {
    axios.get(url, {headers: headers})
    .then(response => {
      dispatch(updateComponents(response.data));
      // dispatch(onReportIDReceive(response.data.id, response.data.projectname));
      // dispatch(updateComponentID(response.components.length));
    })
  }
}

export const updateComponents = (components) => {
  return{
    type: actionTypes.UPDATE_COMPONENTS,
    components: components
  }
}

export const axiosDataSend = (data, url) => {
  return dispatch => {
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        // console.log(response.data);
        // dispatch(onDataSendTo(response.data.thickness, data));
        // console.log("after dispatch");
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
  };
};



//////REPORT

export const requestReport = (projectName, orientation) => {
  return dispatch => {
    const url = "/report/reports/";
    const data = {
      "report_type": "vessel",
      "projectName": projectName,
      "orientation": orientation
    }
    return dispatch(axiosReport(data, url));
  }
};

export const onReportIDReceive = (projectID, data) => {
  return {
    type: actionTypes.REQUEST_REPORT,
    projectID: projectID,
    data: data
  };
};

export const axiosReport = (data, url) => {
  return dispatch => {
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        dispatch(onReportIDReceive(response.data.id, data))
      })
      .catch(err => {
        dispatch(requestFail(err.response));
      });
  };
};

export const requestFail = (error) => {
  return {
    type: actionTypes.REPORT_FAIL,
    error: error
  };
};

export const downloadReport = (id) => {
  return dispatch => {
    const url = "/report/generate";
    const data = {
      projectID: id
    };
    axios.post(url, data, {
      headers: headers
    })
      .then(response => {
        let pdfWindow = window.open('/');
        try{
        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(response.data)+"'></iframe>")
        }
        catch(Exception)
        {
          window.alert("PLEASE ALLOW POP UPS!!!")
        }
        // const file = new Blob(
        //   [response.data],
        //   { type: 'application/pdf' });
        // window.open("http://192.168.10.82:8000/report/generate?Authorization=JWT " + token + "&projectID=" + id);

      });
  }
}

const _base64ToArrayBuffer = (base64) => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}