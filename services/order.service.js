import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";
import { store } from "@firebase/client";

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

export const getOrders = async (email) => {
  try {
    const orders = await store
      .collection("users")
      .doc(email)
      .collection("orders")
      .orderBy("date", "desc")
      .get();

    return orders.docs.map((doc) => doc.data());
    // return doc.data();
  } catch (e) {
    throw e;
  }
};

export const createTempOrder = async (args) => {
  try {
    return await store
      .collection("users")
      .doc(args.email)
      .set(
        {
          preparingOrder: {
            ip: args.session.ip,
            product: args.title.toLowerCase(),
            date: Date.now(),
            price: args.price,
            data: parseInt(args.data),
            stripeOrderId: args.session.payment_intent,
            payment_status: args.session.payment_status,
          },
        },
        { merge: true }
      );
  } catch (e) {
    throw e;
  }
};

export const clearTempOrder = async (email) => {
  try {
    return await store.collection("users").doc(email).set(
      {
        preparingOrder: {},
      },
      { merge: true }
    );
  } catch (e) {
    throw e;
  }
};

export const createNewOrder = async (args) => {
  try {
    return await store
      .collection("users")
      .doc(args.email)
      .collection("orders")
      .doc(uuidv4())
      .set(
        {
          ip: args.ip,
          data: args.data,
          date: Date.now(),
          product: args.product,
          price: args.price,
          stripeOrderId: args.stripeOrderId,
        },
        { merge: true }
      );
  } catch (e) {
    throw e;
  }
};
