import axios from "../../axios-orders";
import * as actionTypes from "./actionTypes";

export const onDataSendFail = error => {
    return {
      type: actionTypes.DATA_SEND_FAIL,
      error: error
    };
  };

export const onDataSend = (data) => {
  
    return dispatch => {
      console.log("Reached");
        const url = "http://192.168.1.12:3000/cylinder/thickness/";
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            "token" : "JWT " + token
          };
        dispatch(axiosDataSend(data,url, headers));
    }
};

export const axiosDataSend = (data, url, headers) => {
    return dispatch => {
        
      axios
        .post(url, data, { headers: headers })
        .then(response => { 
            return {
                type: actionTypes.DATA_SEND,
                response: response
              };
        })
        .catch(err => {
          dispatch(onDataSendFail(err.response));
        });
    };
  };