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

export const onDataSend = (data) => {

  return dispatch => {
    // console.log(data);
    const data1 = {
      cylinderParam: data
    };
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