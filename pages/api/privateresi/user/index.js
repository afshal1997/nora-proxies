import axios from "axios";
import randomstring from "randomstring";
import moment from "moment";

const apiKey = "a4acb8b8-30d2-4e93-a511-f3c66443836f";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  accept: "application/json",
};

const privateResiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRIVATE_RESI_API,
  headers,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dataRequested = req.body.dataRequested;
    const response = await createUser(dataRequested);

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
    const createUserResponse = await privateResiApi.post("users/create");
    const userId = createUserResponse.data.user_id;

    const addBalanceResponse = await addBalance(userId, dataRequested);
    const subUser = {
      status: "Active",
      username: createUserResponse.data.user_id,
      password: createUserResponse.data.password,
      dataRequested: dataRequested,
      dataRemaining: addBalanceResponse.data_gb,
    };

    subUser.expiration = moment().add(30, "days");

    return { success: true, message: "created sub user", subUser };
  } catch (e) {
    console.log(e);
    return { success: false, message: "failed to create user", subUser: null };
  }
}

async function updateUser(subUser, dataRequested) {
  const addBalanceResponse = await addBalance(subUser.username, dataRequested);
  const dataRemaining = addBalanceResponse.data_gb;

  return {
    success: true,
    subUser: {
      ...subUser,
      dataRemaining,
    },
  };
}

async function addBalance(username, dataRequested) {
  const addBalanceResponse = await privateResiApi.post("users/add_balance", {
    user_id: username,
    data_gb: dataRequested,
  });

  return addBalanceResponse.data;
}
