import * as path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';

const { like, eachLike } = MatchersV3;

// Mirrors the exact request OrderForm.tsx sends today: frontend/src/components/OrderForm.tsx (handleSubmit -> fetch POST /orders).
const currentOrderRequestBody = {
  customer: { name: 'Jane Doe', phone: '+15551234567' },
  products: [{ productId: 'a1b2c3d4-e5f6-4789-a123-b456c789d012', quantity: 2 }],
  totalAmount: 2,
};

const provider = new PactV3({
  consumer: 'procura-frontend',
  provider: 'procura-api-gateway',
  dir: path.resolve(__dirname, '..', 'pacts'),
});

describe('POST /orders (current frontend behavior)', () => {
  it('creates an order using productId, as OrderForm.tsx does today', () => {
    provider
      .uponReceiving('a request to create an order using productId')
      .withRequest({
        method: 'POST',
        path: '/orders',
        headers: {
          'Content-Type': 'application/json',
          Authorization: like('Bearer test-token'),
        },
        body: currentOrderRequestBody,
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': like('application/json') },
        body: {
          id: like('c1a2b3d4-e5f6-4789-a123-b456c789d012'),
          customer: currentOrderRequestBody.customer,
          products: eachLike({ productCode: like('SKU-1'), quantity: like(2) }),
          totalAmount: like(2),
          createdAt: like('2026-09-26T00:00:00.000Z'),
        },
      });

    return provider.executeTest(async (mockserver) => {
      const response = await fetch(`${mockserver.url}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify(currentOrderRequestBody),
      });

      expect(response.status).toBe(201);
    });
  });
});
