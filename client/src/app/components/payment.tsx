
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element is null');
      setLoading(false);
      return;
    }
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      const response = await fetch('/api/save-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, customerId: 'cus_exampleId' }),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default Payment;
