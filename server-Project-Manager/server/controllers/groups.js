const express = require('express');

const router = express.Router();

const Group = require('../models/groupModel');

// TOOLS
const { verifyToken, checkToken } = require('../tools/token');


router.get('/all', verifyToken, async (req, res) => {
  try {
    if (await checkToken(req.token)) {
      const groups = await Group.find({});
      res.json(groups);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get('/allfromuser', verifyToken, async (req, res) => {
  try {
    if (await checkToken(req.token)) {
      const groups = await Group.find().elemMatch('members', { _id: req.query.user_id });
      res.json(groups);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get('/one', verifyToken, async (req, res) => {
  try {
    if (await checkToken(req.token)) {
      const group = await Group.find({ _id: req.query._id});
      res.status(200).json(group);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error,
    });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  let groupToAdd = {
    title: req.body.title,
    description: req.body.description,
    members: req.body.members,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    meetingsDone: [],
    meetingsPlanned: [],
  };

  try {
    groupToAdd = new Group(groupToAdd);
    const groupAdded = await groupToAdd.save();
    res.status(200).json(groupAdded);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.put('/update/members/:groupId', verifyToken, async (req, res) => {
  console.log(req.params.groupId);
  try {
    if (await checkToken(req.token)) {
      const modif = {
        members: req.body.members
      };
      const updateStatus = await Group.updateOne(
        { _id: req.params.groupId },
        modif,
        { upsert: true }
      );
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error
    });
  }
});

router.put('/:groupId/delete/member/:memberId', verifyToken, async (req, res) => {
  console.log(req.params.groupId);
  try {
    if (await checkToken(req.token)) {
      const modif = {
        members: req.body.members.filter((member) => member._id !== req.params.memberId)
      };
      const updateStatus = await Group.updateOne(
        { _id: req.params.groupId },
        modif,
        { upsert: true }
      );
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error
    });
  }
});

router.put('/:groupId/update/enddate', verifyToken, async (req, res) => {
  console.log(req.params.groupId);
  try {
    if (await checkToken(req.token)) {
      const modif = {
        endDate: req.body.endDate
      };
      const updateStatus = await Group.updateOne(
        { _id: req.params.groupId },
        modif,
        { upsert: true }
      );
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error
    });
  }
});

router.delete('/delete/:groupId', verifyToken, async (req, res) => {
  console.log(req.params.groupId);
  try {
    if (await checkToken(req.token)) {
      const updateStatus = await Group.deleteOne({ _id: req.params.groupId });
      console.log(updateStatus);
      res.status(200).json(updateStatus);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
