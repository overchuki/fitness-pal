import { createStore } from "redux";
import { reducer } from "./reducer";

const store = createStore(reducer);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
