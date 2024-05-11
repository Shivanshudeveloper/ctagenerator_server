const jwt = require('jsonwebtoken');

const User_Model = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY;

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid' });
        }

        req.user = user;
        next();
    });
};

// Middleware to validate API key
const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.headers['api-key'];
    console.log(`Checking API Key: ${apiKey}`);
  
    if (!apiKey) {
      return res.status(403).json({ error: 'No API Key Found' });
    }
  
    try {
      const user = await User_Model.findOne({ apiKey });
      if (!user) {
        return res.status(403).json({ error: 'Invalid API Key' });
      }
  
      // Attach user information to the request for later use
      req.user = user;
      next();
    } catch (error) {
      res.status(500).send('Internal server error');
    }
};

module.exports = {
    validateToken,
    authenticateApiKey
}