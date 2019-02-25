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

export const onDataSend = (data,id) => {

  return dispatch => {
    // console.log(data);
    let data1 = null;
    if (data.component === "Cylinder") {
      data1 = {
        cylinderParam: data,
        projectID: id
      };
    } else if(data.component === "Ellipsoidal Head"){
      data1 = {
        headParam: data,
        projectID: id
      };
    }
console.log(data1);


const url = "/api/cylinder/data";
const token = localStorage.getItem("token");
// console.log(token);
const headers = {
  "Content-Type": "application/json",
  "Authorization": "JWT " + token
};
dispatch(axiosDataSend(data1, url, headers));
  }
};

export const axiosDataSend = (data, url, headers) => {
  return dispatch => {
    axios
      .post(url, data, { headers: headers })
      .then(response => {
        console.log(response.data.thickness);
        dispatch(onDataSendTo(response.data.thickness, data));
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
          .post(url, authData, { headers: headers })
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