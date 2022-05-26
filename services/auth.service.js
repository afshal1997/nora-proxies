import firebase from "firebase/app";
import { auth, store } from "@firebase/client";
import { sendError } from "./discord/webhooks";

export const getUser = async (email) => {
  try {
    const user = store.collection("users").doc(email);
    const doc = await user.get();
    return doc.data();
  } catch (e) {
    console.log(e);
    throw new GetUserError(email);
  }
};

export const discordLogin = async (token, discordUser) => {
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

    const discordDisplayName = `${discordUser.username}#${discordUser.discriminator}`;

    const result = await auth.signInWithCustomToken(token);
    if (!result.user.email || result.user.email != discordUser.email) {
      await result.user.updateEmail(discordUser.email);
    }

    if (
      !result.user.displayName ||
      result.user.displayName != discordDisplayName
    ) {
      await result.user.updateProfile({
        displayName: discordDisplayName,
      });
    }

    const u = await getUser(discordUser.email);

    if (u == null || Object.keys(u).length <= 3) {
      await createUser(result.user, discordUser);
    } else {
      await updateUser(result.user, u, discordUser);
    }

    return {
      discord: { ...discordUser },
      stripeCustomerId: "",
      displayName: result.user.displayName,
      email: result.user.email,
      authenticated: true,
    };
  } catch (e) {
    console.log(e);
    throw new DiscordLoginError(discordUser);
  }
};

const updateUser = async (user, existingUser, discordUser) => {
  try {
    await store
      .collection("users")
      .doc(user.email)
      .set(
        {
          ...existingUser,
          packet: { ...existingUser.packet },
          privateresi: { ...existingUser.privateresi },
          displayName: user.displayName,
          email: user.email,
          discord: { ...discordUser },
          last_updated_date: Date.now(),
        },
        { merge: true }
      );
  } catch (e) {
    console.log(e);
    throw new UpdateUserError({ ...data, email });
  }
};

const createUser = async (user, discordUser) => {
  try {
    await store
      .collection("users")
      .doc(user.email)
      .set({
        displayName: user.displayName,
        packet: {
          username: "",
          password: "",
          status: "",
          dataRequested: 0,
          dataRemaining: 0,
          expiration: "",
        },
        privateresi: {
          username: "",
          password: "",
          status: "",
          dataRequested: 0,
          dataRemaining: 0,
          expiration: "",
        },
        email: user.email,
        discord: { ...discordUser },
        stripeCustomerId: "",
        created_date: Date.now(),
      });
  } catch (e) {
    console.log(e);
    throw new CreateUserError(discordUser);
  }
};

class CreateUserError extends Error {
  constructor(discord) {
    super(`Error attempting to create user info: ${discord}`);
    this.name = "CreateUserError";
  }
}

class UpdateUserError extends Error {
  constructor(discord) {
    super(`Error attempting to update user: ${discord}`);
    this.name = "UpdateUserError";
  }
}

class GetUserError extends Error {
  constructor(email) {
    super(`Error attempting to get user from firebase: ${email}`);
    this.name = "GetUserError";
  }
}

class DiscordLoginError extends Error {
  constructor(discord) {
    super(`Error logging in: ${discord}`);
    this.name = "UpdateUserError";
  }
}
