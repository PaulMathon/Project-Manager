const jwt = require('jsonwebtoken');

const TOKEN_KEY = 'secretKey';


const signToken = async (user) => {
  const token = await new Promise((resolve, reject) => {
    jwt.sign({ user }, TOKEN_KEY, (err, tokenResp) => {
      if (err) reject(err);
      resolve(tokenResp);
    });
  });

  return token;
};

const checkToken = async (token) => {
  const result = await new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_KEY, (err, authData) => {
      if (err) reject(err);
      resolve(authData);
    });
  });

  return result;
};

// Verify Token

const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers.authorization;

  // Actual format of bearerHeader : Authorization: Bearer <access_token>

  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Get the token from bearerHeader
    // Split at the space and token from array
    const token = bearerHeader.split(' ')[1];

    // Set the token in the req object
    req.token = token;

    // Next Middleware
    next();
  } else {
    // Forbidden, put 404 status
    res.sendStatus(403);
  }
};


module.exports = {
  signToken,
  checkToken,
  verifyToken,
};
