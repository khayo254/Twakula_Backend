const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../src/database');

let server;

beforeAll(async () => {
  await connectDB();

  // Start the server
  const PORT = process.env.PORT || 3001;
  server = app.listen(PORT, () => {
    console.log(`Test server is running on port ${PORT}`);
  });
});

beforeEach(async () => {
  // Clean up the database before each test
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  // Close the server after all tests
  await server.close();

  // Disconnect from the database after all tests
  await mongoose.disconnect();
});

describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'test_user',
        email: 'usertest@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should return 400 if email already exists', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'testpassword',
      });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });
});

describe('POST /api/users/login', () => {
  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'testpassword',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'testpassword',
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  it('should return 401 if invalid credentials', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        username: 'invaliduser',
        email: 'invalid@example.com',
        password: 'testpassword',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});

describe('GET /api/users/profile', () => {
  it('should return user profile with valid token', async () => {
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        username: 'profileuser',
        email: 'profile@example.com',
        password: 'testpassword',
      });

    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'profile@example.com',
        password: 'testpassword',
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'profileuser');
    expect(res.body).toHaveProperty('email', 'profile@example.com');
  });

  it('should return 401 unauthorized without token', async () => {
    const res = await request(app).get('/api/users/profile');

    expect(res.statusCode).toEqual(401);
  });
});
