import axios from "axios";
import randomstring from "randomstring";

const apiKey = "25428aae-75d0-4ee9-ab60-f0931ffc28fb";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  accept: "application/json",
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/packet/`,
  headers,
});

export const generateProxy = (
  amount,
  username,
  country,
  password,
  rotating
) => {
  const proxy = [];

  for (var i = 0; i < parseInt(amount); i++) {
    if (rotating) {
      proxy.push(
        `nora-pro.noraproxies.co:31112:${username}:${password}_country-${country}`
      );
    } else {
      let session = randomstring.generate({
        length: 32,
        charset: "alphabetic",
      });

      proxy.push(
        `nora-pro.noraproxies.co:31112:${username}:${password}_country-${country}_session-${session}`
      );
    }
  }

  return { success: true, proxies: proxy };
};

export const createSubUser = async (dataRequested) => {
  try {
    const createUserResponse = await api.post("user", { dataRequested });

    return createUserResponse.data;
  } catch (e) {
    console.log(e);
    throw { success: false, message: "failed to create user", subUser: null };
  }
};

export const updateSubUser = async (subUser, dataRequested) => {
  const response = await api.put("user", { subUser, dataRequested });

  return response.data;
};

export const getSubUser = async (username) => {
  const url = `user/${username}`;

  const subUser = await api.get(url);

  return subUser.data;
};
