/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";

import { useAuth } from "@contexts/AuthContext";

import GenerateProxies from "./GenerateProxies";
import TopUp from "./TopUp";

const Profile = ({ products, proCountries, eliteCountries }) => {
  const { currentUser } = useAuth();

  return (
    <div className="proxy-profile-wrap">
      <div className="row">
        <div className="col-lg-6 col-md-6">
          <div className="profile-poxies">
            <div className="pro">
              <img src={currentUser.discord.avatar} alt="" />
            </div>
            <div className="por-txt">
              <span>Welcome back,</span>
              <h4>
                {currentUser.discord.username}#
                {currentUser.discord.discriminator}
              </h4>
            </div>
          </div>
          <GenerateProxies
            proCountries={proCountries}
            eliteCountries={eliteCountries}
          />
        </div>
        <div className="col-lg-6 col-md-6">
          <TopUp products={products} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
