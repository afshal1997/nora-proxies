/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useDashboard } from "@contexts/DashboardContext";
import { useAuth } from "@contexts/AuthContext";
import { generateProxies } from "@services/dashboard.service";
import { useToasts } from "react-toast-notifications";
import { generateResi } from "@actions/generate";

import Select from "react-select";
import { selectStyles } from "../styles/select-style";
import { PRODUCTS } from "@utils/products";

const GenerateProxies = ({ proCountries, eliteCountries }) => {
  const { addToast, removeToast } = useToasts();
  const { currentUser } = useAuth();
  const { dispatch } = useDashboard();
  const [proCountriess, setProCountries] = useState(proCountries);
  const [eliteCountriess, setEliteCountries] = useState(eliteCountries);
  const [planType, setPlanType] = useState();
  const [proxyType, setProxyType] = useState("static");
  const [pool, setPool] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [poolOptions, setPoolOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);

  const handleGenerateProxies = async () => {
    try {
      let proxies = [];
      if (planType.label.toLowerCase() === PRODUCTS.PRIVATERESI) {
        proxies = await generateProxies(PRODUCTS.PRIVATERESI, {
          amount: quantity,
          country: pool.value,
          password: currentUser.privateresi.password,
          rotating: proxyType.value,
        });
      }

      if (planType.label.toLowerCase() === PRODUCTS.PACKET) {
        proxies = await generateProxies(PRODUCTS.PACKET, {
          amount: quantity,
          username: currentUser.packet.username,
          country: pool.value,
          password: currentUser.packet.password,
          rotating: proxyType.value,
        });
      }

      if (proxies.length > 0) {
        dispatch(generateResi(proxies));
      }
    } catch (e) {
      console.log(e);
      addToast("Error generating proxies.", {
        appearance: "warning",
        autoDismiss: false,
      });
    }
  };

  useEffect(() => {
    setTypeOptions([
      { value: 1, label: "Sticky" },
      { value: 2, label: "Rotating" },
    ]);

    setPlanOptions([
      { value: 1, label: "Nora Pro" },
      { value: 2, label: "Nora Elite" },
    ]);
  }, []);

  const handlePlanTypeChange = (selectedOption) => {
    if (selectedOption.value === 1) {
      setPlanType(selectedOption);
      setPoolOptions(proCountriess);
    } else if (selectedOption.value === 2) {
      setPlanType(selectedOption);
      setPoolOptions(eliteCountriess);
    } else {
      setPoolOptions([]);
    }
  };

  return (
    <div className="generate-proxies">
      <h4>Generate Proxies</h4>
      <div className="proxies-select">
        <div className="price-box">
          <div className="dataicon">
            <img src="/imgs/icon_1.png" alt="" />
          </div>
          <Select
            value={planType}
            styles={selectStyles}
            isMulti={false}
            placeholder="Select Plan"
            options={planOptions}
            onChange={(selectedOption) => handlePlanTypeChange(selectedOption)}
          ></Select>
        </div>
        <div className="price-box">
          <div className="dataicon">
            <img src="/imgs/pool.png" alt="" />
          </div>
          <Select
            value={pool}
            styles={selectStyles}
            isMulti={false}
            placeholder="Select Proxy Pool"
            options={poolOptions}
            onChange={(selectedOption) => setPool(selectedOption)}
          ></Select>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="price-box amout_field">
              <div className="dataicon">
                <img src="/imgs/up.png" alt="" />
              </div>
              <div className="amount-input">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Amount"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="price-box proxy-type">
              <div className="dataicon">
                <img src="/imgs/pool.png" alt="" />
              </div>
              <Select
                value={proxyType}
                styles={selectStyles}
                isMulti={false}
                placeholder="Select Proxy Type"
                options={typeOptions}
                onChange={(selectedOption) => setProxyType(selectedOption)}
              ></Select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="poxies-btn">
              <button onClick={handleGenerateProxies}>GENERATE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateProxies;
