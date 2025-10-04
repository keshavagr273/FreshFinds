const request = require('supertest');
const { app } = require('../server');

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/customer-signup should create a new customer', async () => {
    const customerData = {
      username: 'Test Customer',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    };

    const response = await request(app)
      .post('/api/auth/customer-signup')
      .send(customerData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.role).toBe('customer');
    expect(response.body.token).toBeDefined();
  });

  test('POST /api/auth/customer-login should authenticate customer', async () => {
    const loginData = {
      userID: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/customer-login')
      .send(loginData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});

describe('Products Endpoints', () => {
  test('GET /api/products should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/products/category/fruits should return fruits', async () => {
    const response = await request(app)
      .get('/api/products/category/fruits')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});