interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

interface CheckoutSessionResponse {
  url: string;
}

const button = document.getElementById('checkout-button') as HTMLButtonElement;

button.addEventListener('click', async () => {
  const lineItems: LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'T-shirt',
        },
        unit_amount: 2000,
      },
      quantity: 1,
    },
  ];

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lineItems,
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    }),
  });

  const session: CheckoutSessionResponse = await response.json();
  window.location.href = session.url;
});