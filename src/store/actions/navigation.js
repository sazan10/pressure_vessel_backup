import * as actionTypes from "./actionTypes";
import axios from '../../axios-orders';

export const clickMenu = (title, id, stateKey) => {
  return {
    type: actionTypes.CLICK_MENU,
    title: title,
    id: id,
    stateKey: stateKey
  };
};

export const disableNew = () => {
  return {
    type: actionTypes.DISABLE_NEW
  };
};

export const importModel = (title, num) => {
 
  return dispatch => {
    dispatch(updateTitle(title));
    import(`../../JSONFiles/Components/${title.replace(
      " ",
      ""
    )}Param${num}.json`).then(function(response) {
      dispatch(returnModel(response.default));
    });
  };
};

export const updateTitle=(title)=>
{
  return {
    type: actionTypes.UPDATE_TITLE,
    title:title
  };
}


export const importForm = title => {
  if (title === "New") {
    return dispatch => {
      // console.log("Inside actions " + title );
      import(`../../JSONFiles/FormDialog/${title.replace(" ", "")}.json`).then(
        function(response) {
          // console.log(response.default);
          dispatch(returnForm(response.default));
        }
      );
    };
  } else if (title === "Open") {
    return dispatch => {
      const url = "/report/reports/";
      const headers = {
        "Content-Type": "application/json",
        Authorization: "JWT " + localStorage.getItem("token")
      };
      const data = {
        type: "projects"
      };
      axios
        .get(url,{headers: headers})
        .then(response => {
          const projects =[];
          response.data.map(project => {
            return projects.push({id: project.id, projectName: project.projectName})
          })
          
          dispatch(importProjects(projects));
        })
        .catch(error => {
          console.log(error);
        });
    };
  }
};
 
//to update the state for vessel projects to appear when OPEN is clicked
export const importProjects = (projects) => {
  return {
    type: actionTypes.IMPORT_PROJECTS,
    projects: projects
  }
}

export const returnForm = model => {
  return {
    type: actionTypes.IMPORT_FORM_MODEL,
    model: model
  };
};

export const returnModel = model => {
  return {
    type: actionTypes.IMPORT_COMPONENT_MODEL,
    model: model
  };
};

export const loadNext = title => {
  return {
    type: actionTypes.LOAD_NEXT,
    title: title,
    num: 2
  };
};

export const loadPrevious = title => {
  return {
    type: actionTypes.LOAD_PREVIOUS,
    num: 1
  };
};

export const updateNum = num => {
  return {
    type: actionTypes.UPDATE_NUM,
    num: num
  };
};

export const displayComponentTree = value => {
  return {
    type: actionTypes.LOAD_COMPONENT_TREE,
    value: value
  };
};
