import randomstring from "randomstring";

import { store } from "@firebase/client";
import { clearTempOrder, createNewOrder } from "@services/order.service";
import {
  createSubUser as createProSubUser,
  getSubUser as getProSubUser,
  updateSubUser as updateProSubUser,
  generateProxy as generateProProxy,
} from "@services/packetstream.service";
import {
  createSubUser as createEliteSubUser,
  getSubUser as getEliteSubUser,
  updateSubUser as updateEliteSubUser,
  generateProxy as generateEliteProxy,
} from "@services/privateresi.service";
// import {
//   sendPurchase as sendPurchaseWebhook,
//   sendPlan as sendPlanWebhook,
//   sendError as sendErrorWebhook,
// } from "@services/discord/webhooks";

import { verifyStripeRequest } from "./stripe.service";

import { PRODUCTS } from "@utils/products";

export const checkOrders = async (user) => {
  if (user.email) {
    if (user.preparingOrder && Object.keys(user.preparingOrder).length > 0) {
      if (user.preparingOrder.stripeOrderId) {
        try {
          const verifyResponse = await verifyStripeRequest(
            user.preparingOrder.stripeOrderId
          );

          if (verifyResponse.payment_status === "succeeded") {
            const paid = true;
            await createNewOrder({ ...user.preparingOrder, email: user.email });
            const hasOrder = true;
            const dataRequested = user.preparingOrder.data;
            const product = user.preparingOrder.product;
            // await sendPurchaseWebhook({
            //   order: { ...user.preparingOrder },
            //   email: user.email,
            //   discord: user.discord,
            // });

            await clearTempOrder(user.email);
            return { hasOrder, dataRequested, product, paid };
          } else {
            return undefined;
          }
        } catch (e) {
          console.log(e);
          await clearTempOrder(user.email);
          //return order;
        }
      } else {
        await clearTempOrder(user.email);
        return undefined;
      }
    }
  }
};

export const assignData = async (user, dataRequested, product) => {
  try {
    if (product === PRODUCTS.PACKET) {
      let subUserResponse = {};
      if (user.packet.username !== "") {
        const initalDataRequest = user.packet.dataRequested;
        user.packet.dataRequested = initalDataRequest + dataRequested;

        const existingSubUserResponse = await getProSubUser(
          user.packet.username
        );
        if (existingSubUserResponse.success) {
          subUserResponse = await updateProSubUser(user.packet, dataRequested);
        }

        await updatePacket(user, subUserResponse.subUser);
      } else {
        subUserResponse = await createProSubUser(dataRequested);
        await updatePacket(user, subUserResponse.subUser);
      }

      if (subUserResponse.success) {
        return subUserResponse.subUser;
      } else {
        throw new Error("Error assigning nora pro data");
      }
    }

    if (product === PRODUCTS.PRIVATERESI) {
      let subUserResponse = {};
      if (user.privateresi.username !== "") {
        // when they first create a subuser, we are saving how much they reqested
        // so we cna continue adding to that number
        const initalDataRequest = user.privateresi.dataRequested;
        user.privateresi.dataRequested = initalDataRequest + dataRequested;

        const existingSubUserResponse = await getEliteSubUser(
          user.privateresi.username
        );

        if (existingSubUserResponse.success) {
          subUserResponse = await updateEliteSubUser(
            user.privateresi,
            dataRequested
          );
        }

        await updatePrivateResi(user, subUserResponse.subUser);
      } else {
        subUserResponse = await createEliteSubUser(dataRequested);
        await updatePrivateResi(user, subUserResponse.subUser);
      }

      if (subUserResponse.success) {
        return subUserResponse.subUser;
      } else {
        throw new Error("Error assigning nora elite data");
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const updatePacket = async (user, subUser) => {
  try {
    await store
      .collection("users")
      .doc(user.email)
      .set(
        {
          packet: {
            username: subUser.username,
            password: subUser.password,
            dataRequested: subUser.dataRequested,
            dataRemaining: subUser.dataRemaining,
            expiration: subUser.expiration,
            created: Date.now(),
            status: subUser.status,
          },
        },
        { merge: true }
      );
  } catch (e) {
    console.log(e);
    throw new Error("Error updating user nora pro data");
  }
};
const updatePrivateResi = async (user, subUser) => {
  try {
    await store
      .collection("users")
      .doc(user.email)
      .set(
        {
          privateresi: {
            username: subUser.username,
            password: subUser.password,
            dataRequested: subUser.dataRequested,
            dataRemaining: subUser.dataRemaining,
            expiration: subUser.expiration,
            created: Date.now(),
            status: subUser.status,
          },
        },
        { merge: true }
      );
  } catch (e) {
    console.log(e);
    throw new Error("Error updating user nora elite data");
  }
};

export const generateProxies = async (product, args) => {
  try {
    let generateResponse = {};
    if (product === PRODUCTS.PRIVATERESI) {
      generateResponse = generateEliteProxy(
        args.amount,
        args.country,
        args.password,
        args.rotating === 2 ? true : false
      );
    }

    if (product === PRODUCTS.PACKET) {
      generateResponse = generateProProxy(
        args.amount,
        args.username,
        args.country,
        args.password,
        args.rotating === 2 ? true : false
      );
    }

    if (generateResponse.success) {
      return generateResponse.proxies;
    }
  } catch (e) {
    console.log(e);
    throw new Error("Error generating proxies");
  }
};
