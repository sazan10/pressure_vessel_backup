import * as actionTypes from "./actionTypes";
// import axios from "../../axios-orders";
// import * as actions from './index';

// const headers = {
//     "Content-Type": "application/json",
//     "Authorization": "JWT " + localStorage.getItem("token")
//   };
  
  export const requestNewProject = (projectName, orientation) => {
    return {
      type: actionTypes.REQUEST_NEW_PROJECT,
      projectName: projectName,
      orientation: orientation
    }
  };
  
  export const onProjectIDReceived = (projectID, projectName, orientation) => {
    console.log("Project id received")
    return {
      type: actionTypes.ON_PROJECT_ID_RECEIVED,
      projectID: projectID,
      projectName: projectName,
      orientation: orientation
    };
  };
  
  export const requestFail = (error) => {
    return {
      type: actionTypes.REPORT_FAIL,
      error: error
    };
  };
  
  

  export const requestProjectID = (projectName, orientation) => {
    return dispatch => {
      dispatch(requestNewProject(projectName, orientation));
    };
  };

  export const requestNewProjectID = (projectName, orientation) => {
    return dispatch => {
      dispatch(requestNewProject(projectName, orientation));
    };
  };

  export const downloadReport = (projectID) => {
    return {
      type: actionTypes.DOWNLOAD_REPORT,
      projectID: projectID
    }
  }

