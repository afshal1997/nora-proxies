export const sendError = async (payload) => {
  await fetch("/api/discord/error", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const sendContact = async (formValues) => {
  await fetch("/api/discord/contact", {
    method: "POST",
    body: JSON.stringify({
      ...formValues,
    }),
  });
};

export const sendPurchase = async (payload) => {
  await fetch("/api/discord/purchase", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const sendPurchaseFailed = async (payload) => {
  await fetch("/api/discord/paymentFailed", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const sendPlan = async (payload) => {
  await fetch("/api/discord/plan", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
    }),
  });
};
