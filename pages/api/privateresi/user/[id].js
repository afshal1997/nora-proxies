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
  const { id } = req.query;

  const response = await getUser(id);

  res.send(response);
}

async function getUser(username) {
  const url = `users/${username}`;

  const subUser = await privateResiApi.get(url);

  const dataRemaining = subUser.data.data_gb;

  return { success: true, subUser: { ...subUser.data, dataRemaining } };
}
