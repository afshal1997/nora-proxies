const stripe = require("stripe")(process.env.STRIPE_ID);
const domain = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
const cancelled = `${domain}?cancelled=true`;
const imageCDN = `https://noraproxies.co`;
import requestIp from "request-ip";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const { price, image, productName, user } = body;
    let customer = { id: user.stripeCustomerId };

    try {
      if (user.stripeCustomerId === "" || !user.stripeCustomerId) {
        customer = await createStripeCustomer(user);
      } else if (user.stripeCustomerId !== "") {
        await updateStripeCustomer(user);
      } else {
        customer = await createStripeCustomer(user);
      }
    } catch (e) {
      if (
        e.type === "StripeInvalidRequestError" &&
        e.raw.message.includes("No such customer")
      ) {
        // create customer
        customer = await createStripeCustomer(user);
      } else {
        return res.status(e.raw.statusCode).json({
          customer: customer.id,
          ip: requestIp.getClientIp(req),
          error: `${e.type}: ${e.code}: ${e.raw.message}`,
        });
      }
    }

    const session = await createStripeSession(user, customer, {
      productName,
      image,
      price,
    });

    res.json({
      id: session.id,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      customer: customer.id,
      ip: requestIp.getClientIp(req),
    });
  }
}

async function createStripeCustomer(user) {
  return await stripe.customers.create({
    email: user.email,
    name:
      `${user.discord.username}#${user.discord.discriminator}` || user.email,
    description: `Nora User: ${user.discord.username}#${user.discord.discriminator}`,
    metadata: {
      discord_id: `${user.discord.id}`,
      discord: `${user.discord.username}#${user.discord.discriminator}`,
      db_email: `${user.email}`,
    },
  });
}

async function updateStripeCustomer(user) {
  try {
    const updatedCustomer = await stripe.customers.update(
      user.stripeCustomerId,
      {
        email: user.email,
        name:
          `${user.discord.username}#${user.discord.discriminator}` ||
          user.email,
        description: `Nora User: ${user.discord.username}#${user.discord.discriminator}`,
        metadata: {
          discord_id: `${user.discord.id}`,
          discord: `${user.discord.username}#${user.discord.discriminator}`,
          db_email: `${user.email}`,
        },
      }
    );
    return await stripe.customers.retrieve(updatedCustomer.id);
  } catch (error) {
    if (
      error.type === "StripeInvalidRequestError" &&
      error.raw.message.includes("No such customer")
    ) {
      // create customer
      return await createStripeCustomer(user);
    }
  }
}

async function createStripeSession(user, customer, product) {
  const { productName, image, price } = product;
  return await stripe.checkout.sessions.create({
    customer: customer.id,
    metadata: {
      discord_id: `${user.discord.id}`,
      discord: `${user.discord.username}#${user.discord.discriminator}`,
      db_email: `${user.email}`,
    },
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            images: [`${imageCDN}${image}`],
          },
          unit_amount: price * 100,
        },
        description: productName,
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_intent_data: {
      metadata: {
        discord_id: `${user.discord.id}`,
        discord: `${user.discord.username}#${user.discord.discriminator}`,
        db_email: `${user.email}`,
      },
      description: productName,
    },
    allow_promotion_codes: true,
    success_url: domain,
    cancel_url: cancelled,
  });
}
