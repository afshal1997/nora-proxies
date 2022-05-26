import React, { useEffect, useState, useRef } from "react";
import moment from "moment";

import { useAuth } from "@contexts/AuthContext";
import { getSubUser as getEliteSubUser } from "@services/privateresi.service";
import { getSubUser as getProSubUser } from "@services/packetstream.service";

const Plans = ({ orders }) => {
  const {
    currentUser,
    setCurrentUser,
    authenticated,
    logout,
    getFirebaseUser,
  } = useAuth();

  const [elitePlan, setElitePlan] = useState(
    currentUser.privateresi ?? { username: "" }
  );

  const [proPlan, setProPlan] = useState(
    currentUser.packet ?? { username: "" }
  );

  const calculateRemainingDays = (expiry) => {
    const today = moment();
    const todayTime = today.format("hh");
    const expirationDate = moment(expiry);
    const expirationTime = expirationDate.format("hh");

    const daysRemaining = expirationDate.diff(today, "days");

    return {
      daysRemaining,
    };
  };

  useEffect(() => {
    async function loadPlans() {
      if (authenticated) {
        const dbElite = currentUser.privateresi;
        const dbPro = currentUser.packet;

        if (dbElite && dbElite.username != "") {
          const dataElite = await getEliteSubUser(
            currentUser.privateresi.username
          );

          const remainingTime = calculateRemainingDays(dbElite.expiration);

          setElitePlan({ ...dbElite, ...dataElite, ...remainingTime });
        }

        if (dbPro && dbPro.username != "") {
          const dataPro = await getProSubUser(currentUser.packet.username);
          const remainingTime = calculateRemainingDays(dbPro.expiration);

          setProPlan({ ...dbPro, ...dataPro, ...remainingTime });
        }
      }
    }

    loadPlans();
  }, [authenticated, currentUser.privateresi, currentUser.packet]);

  return (
    <div className="proxies-plan-wrap">
      <div className="row">
        <div className="col-lg-12">
          <h3>Your Proxy Plan</h3>
        </div>
      </div>
      <div className="row">
        {proPlan.username != "" ? (
          <div className="col-lg-6 col-md-6">
            <div className="proxiex-plan">
              <div className="plan-box">
                <div className="plan-text">
                  <h4 className="gradient-text">Nora Pro</h4>
                  <div className="pan-time">
                    <p>Time Remaining</p>
                    <h5>
                      {proPlan.daysRemaining}D<span>/ 30 Days</span>
                    </h5>
                  </div>
                  <div className="pan-time">
                    <p>Data Remaining</p>
                    <h5>
                      {proPlan.dataRemaining} GB
                      <span>/ {proPlan.dataRequested} GB</span>
                    </h5>
                  </div>
                </div>
                {proPlan.status === "Active" ? (
                  <div className="plan-active">
                    <div className="active-txt">
                      <p>Status</p>
                      <h4>
                        Active <span></span>
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="plan-active">
                    <div className="inactive-txt">
                      <p>Status</p>
                      <h4>
                        Inactive <span></span>
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {elitePlan.username != "" ? (
          <div className="col-lg-6 col-md-6">
            <div className="proxiex-plan">
              <div className="plan-box">
                <div className="plan-text">
                  <h4 className="gradient-text">Nora Elite</h4>
                  <div className="pan-time">
                    <p>Time Remaining</p>
                    <h5>
                      {elitePlan.daysRemaining}D<span>/ 30 Days</span>
                    </h5>
                  </div>
                  <div className="pan-time">
                    <p>Data Remaining</p>
                    <h5>
                      {elitePlan.dataRemaining} GB
                      <span>/ {elitePlan.dataRequested} GB</span>
                    </h5>
                  </div>
                </div>
                {elitePlan.status === "Active" ? (
                  <div className="plan-active">
                    <div className="active-txt">
                      <p>Status</p>
                      <h4>
                        Active <span></span>
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="plan-active">
                    <div className="inactive-txt">
                      <p>Status</p>
                      <h4>
                        Inactive <span></span>
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Plans;
