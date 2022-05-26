import axios from "axios";
const apiKey = "25428aae-75d0-4ee9-ab60-f0931ffc28fb";

const headers = {
  Authorization: `Bearer ${apiKey}`,
  accept: "application/json",
};

const packetStreamApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PACKETSTREAM_API,
  headers,
});

export default async function handler(req, res) {
  const { id } = req.query;

  const response = await getUser(id);

  res.send(response);
}

async function getUser(username) {
  const url = `users/get/${username}`;

  const subUser = await packetStreamApi.get(url);

  const dataRemaining = subUser.data.data_gb;

  return { success: true, subUser: { ...subUser.data, dataRemaining } };
}
