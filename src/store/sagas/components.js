import { put } from "redux-saga/effects";
import * as actions from "../actions/index";
import axios from "../../axios-orders";

const headers = {
  "Content-Type": "application/json",
  Authorization: "JWT " + localStorage.getItem("token")
};

export function* deleteSpecificComponentSaga(action) {
  const url = "api/state/delete";
  const schema = {
    schema: {
      componentID: action.componentID
    },
    projectID: action.projectID
  };
  try {
    yield axios.post(url, schema, { headers: headers });

    yield put(actions.deleteSpecificComponentReducer(action.componentID));
  } catch (error) {
    console.log(error);
  }
}

export function* axiosDataSendSaga(action) {
  try {
    // console.log('In axiosSaga',action.url, action.data);
    yield axios.post(action.url, action.data, {
      headers: headers
    });
    // console.log(response);
  } catch (error) {
    console.log(error);
    yield put(actions.onDataSendFail(error.response));
  }
}

//to import specific project from the server based on project name and id and after receiving response
//updating the project id, project name, components and component ID in redux state
export function* importSpecificProjectSaga(action) {
  // let url = `report/reports/${id}/project/`;
  const url = "api/state/open";
  //console.log(action.projectID);
  try {
    const response = yield axios.get(url, {
      params: {
        projectID: action.projectID
      },
      headers: headers
    });
   // console.log("in import specific project", response);

    yield put(
      actions.onProjectIDReceived(
        response.data.projectID,
        response.data.projectName,
        response.data.orientation
      )
    );
    yield put(actions.updateComponentID(response.data.components.length));
    yield put(actions.updateComponents(response.data.components));
  } catch (error) {
    console.log(error);
  }
}

export function* onSubmitAndUpdateSaga(action) {
  try {
    const response = yield axios.post(action.url, action.data1, {
      headers: headers
    });
   // console.log(response);
    if (
      response.data.thickness !== null ||
      response.data.thicknessResponse != null
    ) {
      let data1 = null;
      if (
        response.data.thickness !== undefined &&
        !response.data.thicknessResponse
      ) {
        data1 = {
          ...action.data,
          ...{
            thickness:
              action.data.thickness < response.data.thickness
                ? roundThickness(response.data.thickness)
                : roundThickness(action.data.thickness),
            value: response.data
          }
        };

        yield put(
          actions.updatePTD(action.data.ip, action.data.temp1, action.data.sd)
        );
      } else {
        data1 = {
          ...action.data,
          ...{
            // thickness:response.data.thicknessResponse,
            value: response.data
          }
        };
      }
      yield put(actions.updateLastItem(action.data.component, data1));
      if (action.data.componentID < action.componentID) {
        //ask for server to save the values in database without doing calculations
        yield put(actions.updateComponent(data1));
        const url = "/api/state/update";
        yield put(actions.sendComponentToJSON(data1, url, action.projectID));
      } else {
        if (data1.component === "Cylinder") {
          for (let i = 0; i < data1.number; i++) {
            yield put(actions.dataUpdate(data1, action.componentID));
            action.componentID = action.componentID + 1;
            yield put(actions.updateComponentID(action.componentID));
          }
        } else {
          yield put(actions.dataUpdate(data1, action.componentID));
          action.componentID = action.componentID + 1;
          yield put(actions.updateComponentID(action.componentID));
        }
        const url = "/api/state/write";
        yield put(actions.sendComponentToJSON(data1, url, action.projectID));
      }
    } else {
      yield put(actions.onDataSendFail("No thickness received"));
    }
  } catch (error) {
    yield put(actions.onDataSendFail(error));
  }
}

const roundThickness = thickness => {
  let t = Math.floor(thickness * 10000);
  const round = Math.ceil(t / 125);
  t = (round * 125) / 10000;
  return t;
};
