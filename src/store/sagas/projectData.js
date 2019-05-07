import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";

const headers = {
  "Content-Type": "application/json",
  Authorization: "JWT " + localStorage.getItem("token")
};

export function* requestNewProjectSaga(action) {
  try {
    const url = "/report/reports/";
    const data = {
      report_type: "vessel",
      projectName: action.projectName,
      orientation: action.orientation
    };
    // console.log(data);
    const response = yield axios.post(url, data, { headers: headers });
    // console.log(response);
    yield put(actions.clearComponentData());
    console.log("components cleared");
    yield put(
      actions.onProjectIDReceived(
        response.data.id,
        action.projectName,
        action.orientation
      )
    );
  } catch (error) {
    yield put(actions.requestFail(error));
  }
}

export function* downloadReportSaga(action) {
  const url = "/report/generate";
  const data = {
    projectID: action.projectID
  };
  try {
    const response = yield axios.post(url, data, { headers: headers });
    let pdfWindow = window.open("/");
    try {
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(response.data) +
          "'></iframe>"
      );
    } catch (Exception) {
      window.alert("PLEASE ALLOW POP UPS!!!");
    }
    yield put(actions.showSpinner(false));
  } catch (error) {
    console.log(error);
  }
}




