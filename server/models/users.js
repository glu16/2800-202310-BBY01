// LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

// THE SCHEMA FOR THE USER COLLECTION
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, unique: true},
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNumber: { type: Number, trim: true },

  email: { type: String, required: true, unique: true},
  password: { type: String, required: true, trim: true, minlength: 4 },

  messages: { type: Array },
  workouts: { type: Array },
  diets: { type: Array },
  userStats: { type: Array },
});

// GENERATES A TOKEN FOR THE USER
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  return token;
};

// THE NAME OF THE COLLECTION 'User', the schema
const User = mongoose.model("User", userSchema);

// JOI VALIDATION
const validate = (user) => {
  const scheme = joi.object({
    username: joi.string().min(3).max(50).required(),
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().required(),
    password: joi.string().min(6).required(),
  });
  return scheme.validate(user);
};

// ALLOWS ACCESS TO THE USER MODEL OUTSIDE OF THIS FILE
module.exports = { User, validate };
