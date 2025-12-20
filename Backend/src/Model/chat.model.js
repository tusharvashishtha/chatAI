const mongoose = require('mongoose');
const chatschema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    title : {
        type : String,
        required : true
    },
    lastActivity : {
        type : Date,
        default : Date.now
    }
},{timestamps : true})

module.exports = mongoose.model('chat', chatschema);