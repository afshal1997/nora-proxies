import { GENERATE } from "@actions/types";

export const generateResi = (value) => {
  return {
    type: GENERATE.GENERATE_PROXIES,
    payload: {
      proxies: value,
    },
  };
};
