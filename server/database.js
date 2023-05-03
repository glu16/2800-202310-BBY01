const mongoose = require('mongoose');

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    try{
        //THIS NEEDS TO BE EDITED TO CONNECT TO MONGO
        mongoose.connect(process.env.DB,connectionParams);
        console.log('Connected to Mongo');
    }catch(err){
        console.log(err);
        console.log('Not connected to Mongo');
    }
}    