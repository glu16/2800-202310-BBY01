// LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE
 
 const mongoose = require('mongoose');
 const jwt = require('jsonwebtoken');
 const joi = require('joi');

// THE SCHEMA FOR THE USER COLLECTION
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true},
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

  email: { type: String, required: true },
  password: { type: String, required: true, trim: true, minlength: 4 },

  gender: { type: String, required: true, trim: true },
  age: { type: Number, required: true, trim: true },
  height: { type: Number, required: true, trim: true },
  weight: { type: Number, required: true, trim: true },
  activityLevel: { type: String, required: true, trim: true },
  goal: { type: String, required: true, trim: true },
  
  messages: { type: Array },
  workouts: { type: Array },
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
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
  });
  return scheme.validate(user);
}

// ALLOWS ACCESS TO THE USER MODEL OUTSIDE OF THIS FILE
module.exports = { User, validate };
