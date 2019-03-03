import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";

export const onDataSendFail = error => {
  return {
    type: actionTypes.DATA_SEND_FAIL,
    error: error
  };
};

export const onDataSendTo = (data) => {
  return {
    type: actionTypes.DATA_SEND,
   // resp: response,
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
   // dispatch(axiosDataSend(data1, url, headers));
   dispatch(onDataSendTo(data1));
  }
};

export const onSubmitAndUpdate = (data) => {
  return dispatch => {
    let url = null;
    console.log(data);
    if (data.component === "Nozzle") {
      url = "/api/nozzle/data";
    }

    const data1 = {
      nozzleParam: data,
      projectID: 1
    };
    const token = localStorage.getItem("token");
    // console.log(token);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "JWT " + token
    };
    // axios
    //   .post(url, data1, { headers: headers })
    //   .then(response => {
    //     console.log(response.data);
    //     const data1 = {
    //       ...data,
    //       ...{thickness: response.data.thickness}
    //     };
        dispatch(dataUpdate(data1));
    //   })
    //   .catch(err => {
    //     dispatch(onDataSendFail(err.response));
    //   });
  }
}

// export const axiosDataSend = (data, url, headers) => {
//   return dispatch => {
//     axios
//       .post(url, data, { headers: headers })
//       .then(response => {
//         console.log(response.data);
//         dispatch(onDataSendTo(response.data.thickness, data));
//         console.log("after dispatch");
//       })
//       .catch(err => {
//         dispatch(onDataSendFail(err.response));
//       });
//   };
// };



//////REPORT

// export const requestReport = () => {
//   return dispatch => {
//     const url = "/report/reports/";
//     const token = localStorage.getItem("token");
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": "JWT " + token
//     };
//     const data = {
//       "report_type": "vessel"
//     }
//     return dispatch(axiosReport(data, url, headers));
//   }

// };

export const onReportIDReceive = projectID => {
  return {
    type: actionTypes.REQUEST_REPORT,
    projectID: projectID
  };
};

// export const axiosReport = (authData, url, headers) => {
//   return dispatch => {
//     axios
//       .post(url, authData, { headers: headers })
//       .then(response => {
//         console.log("report");
//         console.log(response.data.id);
//         dispatch(onReportIDReceive(response.data.id))
//       })
//       .catch(err => {
//         dispatch(requestFail(err.response));
//       });
//   };
// };

export const requestFail = (error) => {
  return {
    type: actionTypes.REPORT_FAIL,
    error: error
  };
};