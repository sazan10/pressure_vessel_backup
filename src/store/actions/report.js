import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

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

export const downloadReport = (id) => {
    return dispatch => {
        const url = "/report/generate";
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "JWT " + token
        };
        const data = {
            projectID: id
        }
        axios
            .post(url, data, { headers: headers })
            .then(response => {
                console.log(response);
            });
    }
}

export const onReportIDReceive = id => {
    return {
      type: actionTypes.REQUEST_REPORT,
      id: id
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
