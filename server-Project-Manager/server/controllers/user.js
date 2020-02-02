const express = require('express');

const router = express.Router();


const User = require('../models/userModel');

const { verifyToken, checkToken } = require('../tools/token');
const { hashPassword } = require('../tools/crypto');

const { handleFileUploadError } = require('../errors/user_errors');
const createLoader = require('../tools/fileLoader');

const upload = createLoader('./../front-Project-Manager/src/assets/pictures/profile-pictures',
  ['.jpeg', '.png', '.jpg']);

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (await checkToken(req.token)) {
      const user = await User.findOne({ _id: req.params.userId })
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post('/uploadprofile', upload.single('profilePicture'), (req, res, next) => {
  if (req) {
    if (!req.file) {
      res.send({
        success: false
      });
      next(handleFileUploadError('NoFile'));
    } else {
      res.send({
        success: true,
      });
    }
  }
});

const updateNameAndLastName = async (request) => {
  const updateStatus = await User.updateOne(
    { _id: request.params.userId },
    {
      name: request.body.name,
      lastName: request.body.lastName
    }
  );
  return updateStatus;
};

const updatePassword = async (request) => {
  const updateStatus = await User.updateOne(
    { _id: request.params.userId },
    { password: await hashPassword(request.body.password) }
  );
  return updateStatus;
};

const updateOtherProfileData = async (request) => {
  const modif = {};
  modif[request.body.modification] = request.body[request.body.modification];
  const updateStatus = await User.updateOne(
    { _id: request.params.userId },
    modif,
    { upsert: true }
  );
  return updateStatus;
};

router.put('/update/:userId', verifyToken, async (req, res) => {
  try {
    if (await checkToken(req.token)) {
      let updateStatus;
      if (req.body.modification === 'name') {
        updateStatus = await updateNameAndLastName(req);
      } else if (req.body.modification === 'password') {
        updateStatus = await updatePassword(req);
      } else {
        updateStatus = await updateOtherProfileData(req);
      }
      res.status(200).json(updateStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error
    });
  }
});

module.exports = router;
