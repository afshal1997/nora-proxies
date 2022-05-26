/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

import { useAuth } from "@contexts/AuthContext";
import { useRouter } from "next/router";
import { checkOrders, assignData } from "@services/dashboard.service";
import { getOrders } from "@services/order.service";
import { useToasts } from "react-toast-notifications";

import Profile from "./Profile";
import Plans from "./Plans";
import ProxyList from "./ProxyList";
import { PRODUCTS } from "@utils/products";

const Dashboard = ({ products, proCountries, eliteCountries }) => {
  const {
    currentUser,
    setCurrentUser,
    authenticated,
    logout,
    getFirebaseUser,
  } = useAuth();
  const router = useRouter();
  const { addToast, removeToast } = useToasts();

  const [orders, setOrders] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push({
        pathname: "/",
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function loadDashboard() {
      if (authenticated) {
        const user = await getFirebaseUser(currentUser.email);

        const userOrders = await getOrders(currentUser.email);

        if (userOrders.length > 0) {
          setOrders(userOrders);
        }

        if (router.query.cancelled === "true") {
          return router.push({
            pathname: "/",
          });
        }

        const pendingOrder = await checkOrders(user);

        if (pendingOrder === undefined) {
          setCurrentUser({
            ...currentUser,
            packet: {
              ...user.packet,
            },
            privateresi: {
              ...user.privateresi,
            },
          });
          return;
        } else if (pendingOrder.hasOrder) {
          const product = pendingOrder.product.toLowerCase().trim();
          const subUser = await assignData(
            user,
            pendingOrder.dataRequested,
            product
          );

          if (pendingOrder.paid) {
            addToast("Payment Successful", {
              appearance: "success",
              autoDismiss: false,
            });
          }

          if (product === PRODUCTS.PACKET) {
            setCurrentUser({
              ...currentUser,
              packet: {
                ...subUser,
                username: subUser.username,
                dataRequested: subUser.dataRequested,
                dataRemaining: subUser.dataRemaining,
              },
            });
          } else if (product === PRODUCTS.PRIVATERESI) {
            setCurrentUser({
              ...currentUser,
              privateresi: {
                ...subUser,
                username: subUser.username,
                dataRequested: subUser.dataRequested,
                dataRemaining: subUser.dataRemaining,
              },
            });
          }
        }
      } else {
        router.push({
          pathname: "/",
        });
      }
    }
    loadDashboard();
  }, [authenticated]);

  return (
    <>
      <div className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-4">
              <div className="logo-dashboard">
                <a href="">
                  <img src="/imgs/logo2.png" alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="header-right">
                <div className="header-all-btn">
                  <a
                    href="https://twitter.com/NoraProxies"
                    className="twitter-btn"
                  >
                    <img src="/imgs/twitter.png" alt="" /> Twitter
                  </a>
                  <a href="https://discord.gg/SG2vxdPz" className="discord">
                    <img src="/imgs/regdit.png" alt="" /> Discord
                  </a>
                  <a href="" className="btn-last" onClick={handleLogout}>
                    <img src="/imgs/logout.png" alt="" /> Logout
                  </a>
                  <Link href="/" className="btn-last">
                    <a href="">
                      <img src="/imgs/home.png" alt="" /> Back
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="proxies-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="proxies-main-wrapper">
                <div className="proxies-left">
                  <Profile
                    products={products}
                    proCountries={proCountries}
                    eliteCountries={eliteCountries}
                  />
                  <Plans orders={orders} />
                </div>

                <ProxyList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
