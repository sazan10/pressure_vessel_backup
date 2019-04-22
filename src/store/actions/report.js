import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

const headers = {
    "Content-Type": "application/json",
    "Authorization": "JWT " + localStorage.getItem("token")
  };
  
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
          dispatch(hideSpinner(false));
          // const file = new Blob(
          //   [response.data],
          //   { type: 'application/pdf' });
          // window.open("http://192.168.10.82:8000/report/generate?Authorization=JWT " + token + "&projectID=" + id);
  
        });
    }
  }

  const hideSpinner = (value) => {
    return {
      type: actionTypes.SHOW_SPINNER,
      value: value
    }
  }