const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: {
    type: String,
    required: true,
    minLength: 3,
  },
  lastname: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Invalid email');
    },
  },
  message: {
    type: String,
    require: true,
    minLength: 3,
  },
});

// Create message collection
const Message = new mongoose.model('userMessages', messageSchema);

module.exports = Message;
