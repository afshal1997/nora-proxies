import axios from "axios";
import randomstring from "randomstring";



const geosurfApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GEOSURF_API,
});

export const generateProxy = async (
  username,
  password,
  userid,
  country,
  city,
  pool,
  type,
  quantity
) => {
  try {
    const data = {
      username,
      password,
      userid,
      country,
      city,
      pool,
      type,
      quantity,
    };

    const response = await geosurfApi.post("/generate", data);
    return { success: true, proxies: response.data.proxies };
  } catch (e) {
    return { success: false, proxies: [] };
  }
};

export const getSubUser = async (userId) => {
  try {
    const response = await geosurfApi.get(`sub-users/${userId}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createSubUser = async () => {
  try {
    const randomUsername = randomstring.generate({ length: 12 });
    const randomPassword = randomstring.generate({ length: 24 });

    const response = await geosurfApi.post("sub-users/", {
      username: randomUsername,
      password: randomPassword,
    });

    return { ...response.data };
  } catch (e) {
    throw e;
  }
};

export const updateSubUser = async (subUserId, dataRequested) => {
  try {
    const response = await geosurfApi.patch(`sub-users/${subUserId}`, {
      trafficLimit: dataRequested,
    });
    return { ...response.data };
  } catch (e) {
    throw e;
  }
};
