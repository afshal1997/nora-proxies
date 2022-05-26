import { store } from "@firebase/client";

export const initStripeSession = async (payload) => {
  const response = await fetch("/api/stripe", {
    method: "POST",
    body: JSON.stringify({ ...payload }),
  });

  return await response.json();
};

export const updateStripeCustomerId = async (email, customerId) => {
  try {
    return await store.collection("users").doc(email).set(
      {
        stripeCustomerId: customerId,
      },
      { merge: true }
    );
  } catch (e) {
    throw e;
  }
};

export const verifyStripeRequest = async (stripeOrderId) => {
  try {
    const response = await fetch("/api/stripe/verify", {
      method: "POST",
      body: JSON.stringify({
        verify: stripeOrderId,
      }),
    });
    return await response.json();
  } catch (e) {
    throw e;
  }
};
