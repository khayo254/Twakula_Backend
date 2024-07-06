const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('connect', () => {
  console.log('Redis client connected...');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = client;
