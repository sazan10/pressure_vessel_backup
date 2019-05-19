import {
  checkValidity,
  checkLLAndHorizontal,
  updateComponentWithNewValues,
  copyFromLast,
  checkForHeadOrientation
} from "./functions";

import {inputToHead, outputFromHead, oldData, newData, outputData, distance} from './data';

test("value should not be null", () => {
  expect(checkValidity("1", { required: true })).toBe(true);
});

test("value should have atleast minimum length", () => {
  expect(checkValidity("1", { minLength: 3 })).toBe(false);
});

test("value should have value lesser than maximum length", () => {
  expect(checkValidity("1", { maxLength: 3 })).toBe(true);
});

test("is value an email", () => {
  expect(checkValidity("swainstha@outlook.com", { isEmail: true })).toBe(true);
});

test("is value a number", () => {
  expect(checkValidity("1231", { isNumeric: true })).toBe(true);
});

test("add distance in ligting lug if orientation is horizontal", () => {
  expect(checkLLAndHorizontal("Lifting Lug", "horizontal", {})).toEqual(distance);
});

test("change to left and right of Ellipsoidal head if orientation is horizontal", () => {
    expect(checkForHeadOrientation("Ellipsoidal Head", "horizontal", inputToHead)).toEqual(outputFromHead);
});


test("copy items from last component", () => {
    expect(copyFromLast(oldData, newData)).toEqual(outputData);
});

test("update component with new values", () => {
    expect(updateComponentWithNewValues(oldData, newData)).toEqual(outputData);
});
