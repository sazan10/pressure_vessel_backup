import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";

export function* importModelSaga(action) {
  yield put(actions.updateTitle(action.title));
  const response = yield import(`../../JSONFiles/Components/${action.title.replace(" ", "")}Param1.json`);
  yield put(actions.returnModel(response.default));
}

export function* importOpenFormSaga(action) {
  const url = "/report/reports/";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "JWT " + localStorage.getItem("token")
  };
  try {
    const response = yield axios.get(url, { headers: headers });
    const projects = [];
    response.data.map(project => {
      return projects.push({
        id: project.id,
        projectName: project.projectName
      });
    });

    yield put(actions.importProjects(projects));
  } catch (error) {
    console.log(error);
  }
}

export function* importNewFormSaga(action) {
  const response = yield import(`../../JSONFiles/FormDialog/New.json`);
  yield put(actions.returnForm(response.default));
}
