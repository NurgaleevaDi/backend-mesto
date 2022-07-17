const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const SECRET_KEY = 'very-secret';
// const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
const generateToken = (payload) => jwt.sign(
  payload,
  NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
  { expiresIn: '7d' },
);
// const checkToken = (token) => jwt.verify(token, SECRET_KEY);
const checkToken = (token) => jwt.verify(token, NODE_ENV ? JWT_SECRET : SECRET_KEY);

module.exports = { generateToken, checkToken };
