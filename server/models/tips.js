// A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  tip: { type: String, required: true },
});

const Tips = mongoose.model("Tip", tipSchema);

module.exports = Tips;
