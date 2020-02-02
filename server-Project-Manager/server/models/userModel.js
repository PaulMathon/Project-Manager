const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  schoolYear: {
    type: String,
    require: true,
  },
  birth: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false
  },
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);
