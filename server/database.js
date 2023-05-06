/*
A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
https://www.youtube.com/watch?v=HGgyd1bYWsE 
*/

const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    //CURRENTLY CONNECTED TO 'users' DATABASE
    mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected to Mongo");
  } catch (err) {
    console.log(err);
    console.log("Not connected to Mongo");
  }
};
