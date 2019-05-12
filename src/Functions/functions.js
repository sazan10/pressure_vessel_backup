import * as LiftingLugAddition from "../JSONFiles/Components/LiftingLugAddition.json";

//check for validity of form elements
export const checkValidity = (value, rules) => {
  console.log("checkValidity");
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }
  if (rules.length) {
    isValid = 0 < value < 15;
  }

  return isValid;
};

//add extra form element as [distance] for lifting lug if the orientation is horizontal.
//The state for element [distance] is import from LiftingLugAddition.json
export const checkLLAndHorizontal = (title, orientation, model) => {
  const updatedModel = { ...model};
  if (title === "Lifting Lug" && orientation === "horizontal") {
    updatedModel["distance"] = LiftingLugAddition.default.liftingLugAddition;
  }
  return updatedModel;
};


//check for orientation and set head  as top and bottom in vertical ans left and right in horizontal orientation
export const checkForHeadOrientation = (title, orientation, model) => {
  if (title === "Ellipsoidal Head" && orientation === "horizontal") {
    const updatedModel = {...model};
    updatedModel.position.elementConfig.options = [
      {
        displayValue: "left",
        value: "0"
      },
      {
        displayValue: "right",
        value: "1"
      }
    ];
    return updatedModel;
  }
  return model;
};


//update last common component values
export const updateComponentValues = (mod, ip, temp1, sd, thickness) => {
  let model = {...mod};
  model.ip.placeholder = ip;
  model.ip.value = ip;
  model.temp1.placeholder = temp1;
  model.temp1.value = temp1;
  model.sd.placeholder = sd;
  model.sd.value = sd;
  model.thickness.placeholder = thickness;
  model.thickness.value = thickness;

  return model;
};

//update component with new values when component is selected by component ID
export const updateComponentWithNewValues = (oldData, newData) => {
    const updatedForm = {
      ...oldData
    };
    for (let key in newData) {
      // console.log(key, updatedForm[key], data[key]);
      if (updatedForm[key] !== undefined) {
        updatedForm[key] = {
          ...updatedForm[key],
          value: newData[key]
          // valid: this.checkValidity(data[key], updatedForm[key].validation),
        };
      }
    }
    return updatedForm;
}


// copy component values from last similar component
export const copyFromLast = (oldData, newData) => {
  const updatedForm = {
    ...oldData
  };
  for (let key in newData) {
    if (key !== "componentID") {
      if (updatedForm[key] !== undefined) {
        updatedForm[key] = {
          ...updatedForm[key],
          value: newData[key]
          // valid: this.checkValidity(data[key], updatedForm[key].validation),
        };
      }
    }
  }
  return updatedForm;
}