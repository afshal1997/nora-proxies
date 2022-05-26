import { GENERATE } from "@actions/types";

export const generateInitalState = {
  proxies: [],
};

export const generateReducer = (state, action) => {
  switch (action.type) {
    case GENERATE.GENERATE_PROXIES:
      return { ...state, proxies: action.payload.proxies };
    default:
      return state;
  }
};
