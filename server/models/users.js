//A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
//https://www.youtube.com/watch?v=HGgyd1bYWsE
 
 const mongoose = require('mongoose');
 const jwt = require('jsonwebtoken');
 const joi = require('joi');

 const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true},
    lastName: { type: String, required: true, trim: true},
    email: { type: String, required: true},
    password: { type: String, required: true, trim: true, minlength: 4},

    //CREATES A LIST OF MESSAGES FOR EACH USER NEW CODE
    messages: [{ type: String }],
    workouts: { type: String }
    //END OF NEW CODE
 });

 userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_KEY);
    return token;
}

const User = mongoose.model('User', userSchema);

const validate = (user) => {
    const scheme = joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    });
    return scheme.validate(user);
}

module.exports = {User, validate};