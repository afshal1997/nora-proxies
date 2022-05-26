import axios from "axios";
import randomstring from "randomstring";

const apiKey = "a4acb8b8-30d2-4e93-a511-f3c66443836f";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  accept: "application/json",
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/privateresi/`,
  headers,
});

export const generateProxy = (amount, country, password, rotating) => {
  const proxy = [];
  const domain = "nora-elite.noraproxies.co";

  for (var i = 0; i < parseInt(amount); i++) {
    if (rotating) {
      proxy.push(`${domain}:5500:country-${country.toLowerCase()}:${password}`);
    } else {
      const session = randomstring.generate({
        length: 32,
        charset: "alphabetic",
      });

      proxy.push(
        `${domain}:5500:country-${country.toLowerCase()}-session-${session}:${password}`
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
