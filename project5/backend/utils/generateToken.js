const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey_event_hub_2026_key', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
