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
      console.log(data);
      const data1 = {
        cylinderParam : data
      };
      console.log(data1);
      
      const dataa = {
        cylinderParam: {
          spec_num: "SA-516",
          type_grade: "70",
          temp1: "150",
          ip: "40",
          sd: "50",
          ic: "60"
        }
      }
        const url = "http://192.168.1.12:8000/api/cylinder/data";
        const token = localStorage.getItem("token");
        console.log(token);
        const headers = {
            "Content-Type": "application/json",
            "Authorization" : "JWT " + token
          };
        dispatch(axiosDataSend(dataa,url, headers));
    }
};

export const axiosDataSend = (data, url, headers) => {
    return dispatch => {
      
      axios
        .post(url, data, { headers: headers })
        .then(response => { 
          console.log(response);
            return {
                type: actionTypes.DATA_SEND,
                component: response
              };
        })
        .catch(err => {
          dispatch(onDataSendFail(err.response));
        });
    };
  };