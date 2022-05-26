import axios from "axios";
import randomstring from "randomstring";

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
  const username = req.body.username;
  const dataRequested = req.body.dataRequested;

  const response = await addBalance(username, dataRequested);

  res.send(response);
}

async function addBalance(username, dataRequested) {
  const addBalanceResponse = await privateResiApi.post("users/add_balance", {
    user_id: username,
    data_gb: dataRequested,
  });

  return addBalanceResponse.data;
}
