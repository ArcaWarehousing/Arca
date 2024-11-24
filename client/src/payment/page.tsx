
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Payment from '@/app/components/payment';

const key = process.env.NEXT_PUBLIC_STRIPE_KEY;
if (!key) {
  throw new Error('Stripe key is not defined.');
}
const stripePromise = loadStripe(key);

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
};

export default PaymentPage;
