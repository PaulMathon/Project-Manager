const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: {
    type: [{
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String
      }
    }],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  meetingsDone: {
    type: Array,
    required: true,
  },
  meetingsPlanned: {
    type: Array,
    required: true,
  },

});

module.exports = mongoose.model('Group', groupSchema);
