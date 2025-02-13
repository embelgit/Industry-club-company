import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "core-js";
import "./global.css";
import App from "./App";
// import store from './store'
import * as serviceWorker from "./serviceWorker";
import { persistor, store } from "./Store/index";
import { PersistGate } from "redux-persist/integration/react";

console.log("store", store, "persist", persistor);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
serviceWorker.unregister();
