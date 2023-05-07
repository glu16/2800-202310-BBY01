const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

const Tip = mongoose.model('Tip', tipSchema);

module.exports = Tip;
