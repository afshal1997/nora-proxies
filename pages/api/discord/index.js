import axios from "axios";
import { credentials } from "@config/discord/credentials";
import { admin } from "@firebase/admin";

const discordApi = axios.create({
  baseURL: "https://discordapp.com/api",
});

export default async function handler(req, res) {
  const { clientId, redirect, scope, clientSecret } = credentials;
  const urlParams = new URLSearchParams();
  urlParams.append("client_id", clientId);
  urlParams.append("client_secret", clientSecret);
  urlParams.append("grant_type", "authorization_code");
  urlParams.append("redirect_uri", redirect);
  urlParams.append("code", req.query.code.toString());
  urlParams.append("scope", scope);

  try {
    const tokenHeader = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const oauthInfo = await discordApi.post("oauth2/token", urlParams, {
      headers: tokenHeader,
    });

    const userHeader = {
      Authorization: `${oauthInfo.data.token_type} ${oauthInfo.data.access_token}`,
    };

    const userInfo = await discordApi.get("users/@me", { headers: userHeader });

    const discordData = {
      id: userInfo.data.id,
      avatar: `https://cdn.discordapp.com/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`,
      email: userInfo.data.email,
      discriminator: userInfo.data.discriminator,
      username: userInfo.data.username,
    };

    let user = null;
    try {
      user = await admin.auth().getUser(discordData.id);
    } catch (e) {
      console.log(
        `user doesn't exist. We will create auth record ${userInfo.data.email}`
      );
    }

    if (!user) {
      user = await admin.auth().createUser({
        uid: discordData.id,
        email: discordData.email,
        emailVerified: true,
        displayName: `${discordData.username}#${discordData.discriminator}`,
        photoURL: discordData.avatar,
        disabled: false,
      });
    }

    // handle if discord email changed
    if (user && user.email != discordData.email) {
      admin.auth().updateUser(user.uid, {
        email: discordData.email,
      });
    }

    var expirationTime = parseInt(process.env.SESSION_EXPIRE_TIME) * 60000;
    var expiresAt = Date.now() + expirationTime;

    const customToken = await admin
      .auth()
      .createCustomToken(user.uid, { expiresAt, expirationTime });

    const responseData = { discord: discordData, loginToken: customToken };
    res.send(responseData);
  } catch (e) {
    if (e.code) {
      const errorCode = e.code;
      if (errorCode === "auth/invalid-custom-token") {
        console.log(e);
      } else {
        console.error(e);
      }

      res.status(401).send({ error: { status: 401, message: e.message } });
    } else {
      console.log(
        "error authenticating with discord. Please review.",
        e.response.data
      );
      res.status(401).send({
        error: { status: 401, message: "Error logging in with Discord" },
      });
    }
  }
}
