const stripe = require("stripe")(process.env.STRIPE_ID);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const { verify } = body;
    const paymentIntent = await stripe.paymentIntents.retrieve(verify);

    res.json({
      payment_status: paymentIntent.status,
      email: paymentIntent.receipt_email,
    });
  }
}
