/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { useAuth } from "@contexts/AuthContext";
import {
  initStripeSession,
  updateStripeCustomerId,
} from "@services/stripe.service";

import { createTempOrder } from "@services/order.service";

import { useToasts } from "react-toast-notifications";
import Select from "react-select";
import { selectStyles } from "../styles/select-style";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY);
const PurchaseCard = ({ product }) => {
  const { setCurrentUser, currentUser, authenticated } = useAuth();
  const { addToast, removeToast } = useToasts();

  const [planType, setPlanType] = useState();
  const [data, setData] = useState(0);
  const [price, setPrice] = useState(0);
  const [dataOption, setDataOption] = useState();
  const [planOptions, setPlanOptions] = useState([]);
  const [purchaseOptions, setPurchaseOptions] = useState([]);

  const handleSetData = async (value) => {
    if (value !== "") {
      setData(value);
      const purchaseOption = product.purchaseOptions.find(
        (x) => x.name === value
      );
      setPrice(purchaseOption.price);
    } else {
      setData(0);
      setPrice(0);
    }
  };

  const handlePurchase = async () => {
    try {
      if (!authenticated) {
        addToast("Please login to purchase.", {
          appearance: "info",
          autoDismiss: false,
        });

        return;
      }

      if (product.active) {
        const stripe = await stripePromise;
        const title = product.title;
        const productName = `${title} ${data}`;
        const session = await initStripeSession({
          price,
          productName,
          image: "/imgs/nora1.png",
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
    setPlanType(product);
    const purchaseOptions = product.purchaseOptions.map((x, i) =>
      Object.create({ value: x.price, label: x.name })
    );

    setPurchaseOptions(purchaseOptions);
  }, []);

  const handleSelectedPurchaseOption = (selectedOption) => {
    setDataOption(selectedOption);
    setPrice(selectedOption.value);
    setData(selectedOption.label);
  };

  return (
    <div className="col-lg-4 col-md-4">
      <div className="pricing-table text-center">
        <div className="card-header">
          <h3 className="mb-0"><b>{product.title}</b></h3>
        </div>
        <div className="pricing-content">
          <div className="work-txt">
            {product.sites.length > 0 ? (
              <>
                <ul>
                  {product.sites.map((site, i) => (
                    <li key={i}>
                      {site}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              ""
            )}
            <p>{product.options}</p>
          </div>
          <div className="price-dtls">
            <ul>
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          {product.active ? (
            <>
              <div className="price-select">
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
              </div>
              <div className="price-btn">
                <button onClick={handlePurchase}>PURCHASE</button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
