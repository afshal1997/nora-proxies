import combineReducers from "react-combine-reducers";
import { generateReducer, generateInitalState } from "@reducers/generate";

export const [rootReducer, initialState] = combineReducers({
  generatedState: [generateReducer, generateInitalState],
});
