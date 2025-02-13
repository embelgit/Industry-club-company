import { combineReducers, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import persistConfig from "./persistConfig";

// actions.js
export const activateGeod = (geod) => ({
  type: "ACTIVATE_GEOD",
  geod,
});

export const closeGeod = (geod) => ({
  type: "CLOSE_GEOD",
  geod,
});

// reducers.js
export const geod = (state = {}, action) => {
  switch (action.type) {
    case "ACTIVATE_GEOD":
      return action.geod;
    case "CLOSE_GEOD":
      return action.geod;
    default:
      return state;
  }
};

export const reducers = combineReducers({
  geod,
});

const persistedReducer = persistReducer(persistConfig, reducers);

// store.js
// export function configureStore(initialState = {}) {
//   const store = createStore(persistedReducer, initialState);
//   return store;
// }

export const configureStore = () => {
  const store = createStore(persistedReducer);
  return store;
};

const store = configureStore();

console.log("----.", store.getState());

const persistor = persistStore(store);

export { store, persistor };
