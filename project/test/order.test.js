// tests/order.test.js
const request = require('supertest');
const app = require('../server');
const Order = require('../models/order');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await Order.deleteMany();
  await mongoose.disconnect();
});

test('Create installment order', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${testToken}`)
    .send({
      productId: '60ab...',
      months: 12
    });
  
  expect(res.status).toBe(201);
  expect(res.body.installments.months).toBe(12);
});