import axios from "axios";
import randomstring from "randomstring";
import moment from "moment";

const apiKey = "25428aae-75d0-4ee9-ab60-f0931ffc28fb";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  accept: "application/json",
  "Content-Type": "application/json",
};

const packetStreamApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PACKETSTREAM_API,
  headers,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dataRequested = req.body.dataRequested;
    const response = await createUser(dataRequested);

    const subUser = await addBalance(response.subUser.username, dataRequested);

    response.subUser.dataRemaining = subUser.data_gb;
    response.subUser.expiration = moment().add(30, "days");

    res.send(response);
  }

  if (req.method === "PUT") {
    const subUser = req.body.subUser;
    const dataRequested = req.body.dataRequested;
    const response = await updateUser(subUser, dataRequested);

    res.send(response);
  }
}

async function createUser(dataRequested) {
  try {
    const url = "users/create";
    const username = randomstring.generate({
      length: 25,
      charset: "alphanumeric",
    });

    const createUserResponse = await packetStreamApi.post(
      url,
      JSON.stringify({ username })
    );

    const subUser = {};

    subUser.status = "Active";
    subUser.username = createUserResponse.data.username;
    subUser.password = createUserResponse.data.password;
    subUser.dataRequested = dataRequested;

    return { success: true, message: "created sub user", subUser };
  } catch (e) {
    console.log(e);
    return { success: false, message: "failed to create user", subUser: null };
  }
}

async function updateUser(subUser, dataRequested) {
  const addBalanceResponse = await addBalance(subUser.username, dataRequested);

  const dataRemaining = addBalanceResponse.data_gb;

  const updatedSubUser = {
    ...subUser,
    dataRemaining,
  };

  return {
    success: true,
    subUser: { ...updatedSubUser },
  };
}

async function addBalance(username, dataRequested) {
  const addBalanceResponse = await packetStreamApi.post("users/add_balance", {
    username,
    data_gb: dataRequested,
  });

  return addBalanceResponse.data;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
