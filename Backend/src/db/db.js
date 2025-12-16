const mongoose = require('mongoose');
require('dotenv').config;


async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Connected to DB");
    }catch(err){
        console.log("Error connected to db : " , err);
    }
}

module.exports = connectDb