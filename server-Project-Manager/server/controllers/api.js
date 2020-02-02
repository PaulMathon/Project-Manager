const express = require('express');

const router = express.Router();

const User = require('../models/userModel');

// TOOLS
const Token = require('../tools/token');

router.get('/users', Token.verifyToken, async (req, res) => {
  try {
    if (await Token.checkToken(req.token)) {
      const users = await User.find();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
