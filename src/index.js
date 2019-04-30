import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import * as serviceWorker from "./serviceWorker";
import thunk from "redux-thunk";
import createSagaMiddleware from 'redux-saga';


import navigationReducer from "./store/reducers/navigation";
import authReducer from './store/reducers/auth';
import componentDataReducer from './store/reducers/componentData';
import {watchAuth, watchNavigation} from './store/sagas/index';

// import reportReducer from './store/reducers/report';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  navigation: navigationReducer,
  auth: authReducer,
  componentData: componentDataReducer,
  // report: reportReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchNavigation);

const app = (
  <Provider store={store}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));
// registerServiceWorker();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
