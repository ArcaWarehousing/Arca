const stripe = require('stripe')('sk_test_51R9CTqEyfWmQhA49gpd5BnyiLLlsCFwSMXcQu6aRiTCCqQhJUwtielZSUdrgxyeHOk13SsMKix7WvvnWDGWkANyS00eL154DJ0');

exports.createCheckoutSession = async (req, res) => {
  console.log("CREATING A CHECKOUT SESSION!");
  try {
    const { lineItems, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ url: session.url });
    console.log("CREATING A CHECKOUT SESSION!");
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.retrieveCheckoutSession = async (req, res) => {
  console.log("RETRIEVING CHECKOUT SESSION!");
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'your-webhook-secret');
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`Checkout session completed: ${session.id}`);
      // Fulfill the purchase...
      break;
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};