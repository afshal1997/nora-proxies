import React, { useEffect, useState, useContext, createContext } from "react";
import { auth, store } from "../firebase/client";
import { discordLogin, getUser } from "@services/auth.service";
import { generateRandomString } from "@utils/auth";

const User = {
  displayName: "",
  email: "",
  stripeCustomerId: "",
  discord: {
    avatar: "",
    id: "",
    username: "",
    discriminator: "",
    email: "",
  },
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
};

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(User);
  const [randomString, setRandomString] = useState("");
  const [loading, setLoading] = useState(true);

  const login = async (token, discordUser) => {
    try {
      return await discordLogin(token, discordUser);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      return auth.signOut();
    } catch (e) {
      throw e;
    }
  };

  const getFirebaseUser = async (email) => {
    try {
      return await getUser(email);
    } catch (e) {
      throw e;
    }
  };

  useEffect(() => {
    let sessionTimeout = null;
    setRandomString(generateRandomString());
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        const firebaseuser = await getFirebaseUser(user.email);
        setCurrentUser({
          ...firebaseuser,
          id: user.uid,
          authenticated: true,
        });

        const token = await user.getIdTokenResult();

        if (token) {
          const expiresAt = token.claims.expiresAt;
          const secondsUntilExpiration = Math.abs(expiresAt - Date.now());
          sessionTimeout = setTimeout(() => {
            auth.signOut();
            window.location.reload();
          }, secondsUntilExpiration);
        }
      } else {
        sessionTimeout && clearTimeout(sessionTimeout);
        sessionTimeout = null;
        setCurrentUser({ ...User, authenticated: false });
      }

      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser.authenticated, currentUser.stripeCustomerId]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authenticated: currentUser?.authenticated ?? false,
        randomString,
        setCurrentUser,
        getFirebaseUser,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
