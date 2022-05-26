/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import Select from "react-select";
import { selectStyles } from "../styles/select-style";

import { useAuth } from "@contexts/AuthContext";
import {
  initStripeSession,
  updateStripeCustomerId,
} from "@services/stripe.service";

import { createTempOrder } from "@services/order.service";

import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY);

const TopUp = ({ products }) => {
  const { setCurrentUser, currentUser, authenticated } = useAuth();
  const { addToast, removeToast } = useToasts();
  const [planType, setPlanType] = useState();
  const [data, setData] = useState(null);
  const [price, setPrice] = useState(0);
  const [dataOption, setDataOption] = useState();
  const [planOptions, setPlanOptions] = useState([]);
  const [purchaseOptions, setPurchaseOptions] = useState([]);

  const handlePurchase = async () => {
    try {
      const product = products.find((x) => x.title == planType.label);
      const purchaseOption = product.purchaseOptions.find(
        (x) => x.name === data
      );

      const price = purchaseOption.price;
      if (product.active) {
        const stripe = await stripePromise;
        const title = product.title;
        const productName = `${title} ${data}`;
        const session = await initStripeSession({
          price,
          productName,
          image: "/imgs/phoneix-logo.png",
          user: currentUser,
        });

        if (session.error !== null && session.error !== undefined) {
          throw new Error(session.error);
        }

        setCurrentUser({ ...currentUser, stripeId: session.customer });

        await updateStripeCustomerId(currentUser.email, session.customer);

        await createTempOrder({
          email: currentUser.email,
          session,
          title,
          price,
          data,
        });

        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
          // will save these error messages to context and access in parent component
          addToast("Error processing payment.", {
            appearance: "error",
            autoDismiss: false,
          });
        }
      } else {
        addToast("Product is not active.. Cannot purchase at this time.", {
          appearance: "warning",
          autoDismiss: false,
        });

        return;
      }
    } catch (e) {
      console.log(e);
      addToast("Error processing payment.", {
        appearance: "error",
        autoDismiss: false,
      });
    }
  };

  useEffect(() => {
    setPlanOptions(
      products
        .filter((x) => x.active)
        .map((x, i) => Object.create({ value: i + 1, label: x.title }))
    );
  }, []);

  const handleSelectedPlanType = (selectedOption) => {
    setPlanType(selectedOption);
    const selectedPlan = products.find((x) => x.title === selectedOption.label);
    const purchaseOptions = selectedPlan.purchaseOptions.map((x, i) =>
      Object.create({ value: x.price, label: x.name })
    );

    setPurchaseOptions(purchaseOptions);
  };

  const handleSelectedPurchaseOption = (selectedOption) => {
    setDataOption(selectedOption);
    setPrice(selectedOption.value);
    setData(selectedOption.label);
  };

  return (
    <div className="popup-box">
      <h4>TOP-UP Data</h4>
      <div className="popup-select">
        <div className="price-box">
          <div className="dataicon">
            <img src="/imgs/icon_1.png" alt="" />
          </div>
          <Select
            value={planType}
            styles={selectStyles}
            isMulti={false}
            options={planOptions}
            onChange={handleSelectedPlanType}
          ></Select>
        </div>
        <div className="price-box">
          <div className="dataicon">
            <img src="/imgs/ci_data.png" alt="" />
          </div>
          <Select
            value={dataOption}
            styles={selectStyles}
            isMulti={false}
            options={purchaseOptions}
            onChange={handleSelectedPurchaseOption}
          ></Select>
        </div>
        <div className="btn-purches">
          <button onClick={handlePurchase}>PURCHASE</button>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
