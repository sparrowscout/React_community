import { createStore, combineReducers,applyMiddleware, compose } from "redux"
import post from "./modules/Post";
import thunk from "redux-thunk";
import users from "./modules/User";

const middlewares = [thunk];
const rootReducer = combineReducers({post, users});

const enhancer = applyMiddleware(...middlewares);

const store = createStore(rootReducer, enhancer);

export default store;