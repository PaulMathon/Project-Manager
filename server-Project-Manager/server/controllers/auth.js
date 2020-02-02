const express = require('express');

const router = express.Router();

const path = require('path');

const multer = require('multer');
const User = require('../models/userModel');

// TOOLS
const Token = require('../tools/token');
const Crypto = require('../tools/crypto');
const ErrorHandler = require('../errors/auth_errors');


router.post('/signin', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error('email');
    if (await Crypto.comparePasswords(req.body.password, user.password)) {
      user.password = undefined;
      console.log({ ...user._doc, token: await Token.signToken(user) });
      res.json({ ...user._doc, token: await Token.signToken(user) });
    } else {
      throw new Error('password');
    }
  } catch (error) {
    next(ErrorHandler.handleSignInError(error));
  }
});

router.post('/signup', async (req, res, next) => {
  const bodyUser = req.body;

  try {
    const hash = await Crypto.hashPassword(req.body.password);
    bodyUser.password = hash;
    const user = new User(bodyUser);
    const result = await user.save();
    const token = await Token.signToken(result);
    res.json({
      _id: result._id,
      email: result.email,
      name: result.name,
      lastName: result.lastName,
      school: result.school,
      schoolYear: result.schoolYear,
      birth: result.birth,
      token,
    });
  } catch (error) {
    next(ErrorHandler.handleSignUpError(error));
  }
});



module.exports = router;
