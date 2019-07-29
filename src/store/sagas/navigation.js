import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";
import * as cylinder from "../../JSONFiles/Components/CylinderParam1.json";
import * as ellipsoidalHead from "../../JSONFiles/Components/EllipsoidalHeadParam1.json";
import * as conical from "../../JSONFiles/Components/ConicalParam1.json";
import * as nozzle from "../../JSONFiles/Components/NozzleParam1.json";
import * as saddle from "../../JSONFiles/Components/SaddleParam1.json";
import * as skirt from "../../JSONFiles/Components/SkirtParam1.json";
import * as liftingLug from "../../JSONFiles/Components/LiftingLugParam1.json";
import * as newProject from "../../JSONFiles/FormDialog/New.json";

export function* importModelSaga(action) {
  yield put(actions.updateTitle(action.title));
  let response = cylinder;
  console.log("inside saga");
  // const response = yield import(`../../JSONFiles/Components/${action.title.replace(" ", "")}Param1.json`);
  //console.log(response);
  switch (action.title) {
    case "Cylinder":
      response = cylinder;
      break;
    case "Ellipsoidal Head":
      response = ellipsoidalHead;
      break;
    case "Conical":
      response = conical;
      break;
    case "Nozzle":
      response = nozzle;
      break;
    case "Lifting Lug":
      response = liftingLug;
      break;
    case "Skirt":
      response = skirt;
      break;
    case "Saddle":
      response = saddle;
      break;

    default:
      break;
  }
  //console.log(response.default);
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
  // const response = yield import(`../../JSONFiles/FormDialog/New.json`);
  const response = newProject;
  yield put(actions.returnForm(response.default));
}
