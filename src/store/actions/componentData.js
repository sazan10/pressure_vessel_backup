import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";


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

export const dataUpdate = (data) => {

  return {
    type: actionTypes.DATA_UPDATE,
    data: data
  }
}

export const onDataSend = (data, id) => {

  return dispatch => {
    console.log(data);
    let url = "/api/cylinder/data";
    let data1 = null;
    if (data.component === "Cylinder") {
      console.log("Inside Cylinder");
      data1 = {
        cylinderParam: data,
        projectID: id
      };
    } else if (data.component === "Ellipsoidal Head") {
      console.log("Inside Head");
      data1 = {
        headParam: data,
        projectID: id
      };
      url = "/api/head/data";
    } else if (data.component === "Nozzle") {
      console.log("Inside Nozzle");
      data1 = {
        nozzleParam: data,
        projectID: id
      };
      url = "/api/nozzle/data";
    }
    console.log(data1);

    const token = localStorage.getItem("token");
    // console.log(token);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "JWT " + token
    };
    dispatch(axiosDataSend(data1, url, headers));
  }
};

export const onSubmitAndUpdate = (data, id) => {
  return dispatch => {
    let url = null;
    let data1 = null
    console.log("onSUbmitUpdate");
    if (data.material !== null) {
      const mat = data.material.split(" ");
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
        projectID: 1
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
        console.log(response.data);
        if (response.data.thicknesss !== null) {
          const data1 = {
            ...data,
            ...{
              thickness: response.data.thickness
            }
          };
          dispatch(dataUpdate(data1));
        } else {
          dispatch(onDataSendFail("No thickness received"));
        }
      })
      .catch(err => {
        dispatch(onDataSendFail(err.response));
      });
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
        const reportUrl = "http://192.168.1.12:8001/" + response.data;
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