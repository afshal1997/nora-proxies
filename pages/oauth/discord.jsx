/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { useAuth } from "@contexts/AuthContext";
import Head from "next/head";

const Discord = ({ discordOauthData }) => {
  const { login, logout, setCurrentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function handleLogin() {
      try {
        if (discordOauthData === null) {
          throw new Error("Discord login failed");
        }

        const user = await login(
          discordOauthData.loginToken,
          discordOauthData.discord
        );

        if (user.authenticated) {
          setCurrentUser({
            authenticated: user.authenticated,
            displayName: user.displayName,
            email: user.email,
            stripeCustomerId: user.stripeCustomerId,
            discord: {
              avatar: user.discord.avatar,
              id: user.discord.id,
              username: user.discord.username,
              discriminator: user.discord.discriminator,
              email: user.discord.email,
            },
          });
          router.push({
            pathname: "/dashboard",
          });
        } else if (!user.authenticated) {
          router.push({
            pathname: "/",
          });
        }
      } catch (e) {
        console.log(e);
        await logout();
        router.push({
          pathname: "/",
          query: { discord_verified: false },
        });
      }
    }

    handleLogin();
  }, []);

  return (
    <>
      <Head>
        <title>Redirecting to Dashboard</title>
      </Head>
      ;<div style={{ backgroundColor: "black" }}></div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { res, query } = context;
  const domain = `${process.env.NEXT_PUBLIC_APP_URL}`;
  try {
    const response = await axios.get(
      `${domain}/api/discord?code=${query.code}`
    );
    const data = response.data;
    return {
      props: {
        discordOauthData: data,
      },
    };
  } catch (e) {
    console.log(e);
    res.setHeader("location", `/?error=${e.message}`);
    res.statusCode = 302;
    res.end();
    return { props: { discordOauthData: null } };
  }
};

export default Discord;
