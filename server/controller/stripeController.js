const Stripe = require('stripe');


const stripe = new Stripe(process.env.STRIPE_KEY_SECRET);

exports.createCustomer = async (req, res) => {
  console.log("CREATING A CUSTOMER!");
  const customer = await stripe.customers.create({
    name: 'Jenny Rosen',
    email: 'jennyrosen@example.com',
  });
  console.log(customer)
  res.send(200);
};

exports.createPaymentMethod = async (req, res) => {
  console.log("CREATING A PAYMENT METHOD!");
  try {
    const { customerId } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '1234123412341234',
        exp_month: 12,
        exp_year: 2024,
        cvc: '123',
      },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });
    console.log(paymentMethod.id)

    res.status(200).send({paymentId: paymentMethod.id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.savePaymentMethod = async (req, res) => {
    console.log("SAVING PAYMENT METHODS2!");
    try {
      const { paymentId, customerId, type } = req.body; 

      if(!paymentId || !customerId){
        return res.stats(400).json({error: 'need payment and customer IDs'})
      }
      const connectedAccount = "acct_1PgI70Q88yl1lgI4";

      let paymentMethod
      try{
        paymentMethod = await stripe.paymentMethods.retrieve(paymentId, {connectedAccount,})
      } catch(error){
        return res.status(404).json({error: 'no payment method'})
      }

      try{
        await stripe.paymentMethods.attach(paymentId, {
        customer: customerId,
        connectedAccount,
      });
    }catch(error){
      return res.status(404).json({error: 'payment method not attached'})
    }
     
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
        connectedAccount,
      });
  
      res.status(200).json({ paymentId: paymentMethod.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.chargePayment = async(req,res) =>{
    console.log("CHARGING PAYMENT METHODS!");
    try {
        const { amount, currency, customerId, paymentId } = req.body;
    
    
        const paymentIntent = await stripe.paymentIntents.create({
          
          amount,
          currency,
          customer: customerId,
          payment_method: paymentId,
          off_session: true,
          confirm: true,
        });
    
        res.status(200).json({ paymentIntentId: paymentIntent.id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  }