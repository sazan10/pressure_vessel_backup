import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";


export const onDataSendFail = error => {
  return {
    type: actionTypes.DATA_SEND_FAIL,
    error: error
  };
};

export const onDataSendTo = (response, data) => {
  console.log("nozzle data", data);
  return {
    type: actionTypes.DATA_SEND,
    resp: response,
    component: data
  };
};

export const dataUpdate1 = (data, componentID,height1) => {
 
console.log("height compo",data);
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
export const onSubmitAndUpdate = (data, id, componentID) => {
  return dispatch => {
    let url = null;
    let data1 = null
    console.log("onSubmitUpdate", data);
    if (data.material !== undefined) {
      const mat = data.material.split(" ");
      data.length = data.length * 12;
      data = {
        ...data,
        spec_num: mat[0],
        type_grade: mat[1],
      }
    }
    url = "/api/cylinder/data";

    if (data.component === "Ellipsoidal Head") {
      data1 = {
        headParam: data,
        projectID: id
      };
      url = "/api/head/data";
    } else if (data.component === "Cylinder") {
      url = "/api/cylinder/data";
      data1 = {
        cylinderParam: data,
        projectID: id
      };
    } else if (data.component === "Nozzle") {
      url = "/api/nozzle/data";
      data1 = {
        nozzleParam: data,
        projectID: id
      };
    }
    else if (data.component === "Conical") {
      url = "/api/conicalCylinder/data";
      data1 = {
        conicalParam: data,
        projectID: id
      };
      
    }
    else if (data.component === "Skirt") {
      url = "/api/skirt/data";
      data1 = {
        skirtParam: data,
        projectID: id
      };
    }

    console.log(data1);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "JWT " + token
    };
    axios
      .post(url, data1, {
        headers: headers
      })
      .then(response => {
        console.log("Response", response.data);
        if (response.data.thicknesss !== null) {
          const data1 = {
            ...data,
            ...{
              thickness: response.data.thickness,
              value:response.data
            }
          };
          if (data.componentID < componentID) {
            console.log("UPDATE COMPONENT");
            dispatch(updateComponent(data1));
          } else {
            console.log("ADD COMPONENT");
            dispatch(dataUpdate(data1, componentID));
            const newID = componentID + 1;
            dispatch(updateComponentID(newID));
          }

        } else {
          dispatch(onDataSendFail("No thickness received"));
        }
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
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

export const axiosDataSend = (data, url, headers) => {
  return dispatch => {
    axios
      .post(url, data, {
        headers: headers
      })
      .then(response => {
        console.log(response.data);
        dispatch(onDataSendTo(response.data.thickness, data));
        console.log("after dispatch");
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
  };
};



//////REPORT

export const requestReport = () => {
  return dispatch => {
    const url = "/report/reports/";
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "JWT " + token
    };
    const data = {
      "report_type": "vessel"
    }
    return dispatch(axiosReport(data, url, headers));
  }
};

export const onReportIDReceive = projectID => {
  return {
    type: actionTypes.REQUEST_REPORT,
    projectID: projectID
  };
};

export const axiosReport = (authData, url, headers) => {
  return dispatch => {
    axios
      .post(url, authData, {
        headers: headers
      })
      .then(response => {
        console.log("report");
        console.log(response.data.id);
        dispatch(onReportIDReceive(response.data.id))
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
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "JWT " + token,
      "responseType": 'arraybuffer'
      // 'Accept': 'application/pdf'
    };
    const data = {
      projectID: id
    };
    console.log(data);
    axios.post(url, data, {
      headers: headers
    })
      .then(response => {
        console.log("Inside axios post");
        console.log(response.data);
        const reportUrl = "http://192.168.1.12:8000/" + response.data;
        // const pdfData = base64.decode(response.data);
        // const pdfData = pako.deflate(response.data);
        // console.log(pdfData);
        // const file = new Blob(
        //   [pdfData], 
        //   {type: 'application/pdf'});
        // Download(file, "report.pdf");

        // const fileURL = URL.createObjectURL(file);
        // console.log(response);

        window.open(reportUrl);
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