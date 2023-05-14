const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: {
    type: String
  }
});

const Image = new mongoose.model('Image', imageSchema);

module.exports = Image;