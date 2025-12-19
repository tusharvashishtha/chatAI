const chatModel = require('../Model/chat.model');

async function createchat(req, res) {

    const {tittle} = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user : user._id,
        title
    });

    res.status(201).json({
        message : "Chat created succesfully",
        chat : {
            _id : chat._id,
            title: chat.tittle,
            lastActivity  : chat.lastActivity
        }
    })
    
}

module.exports = createchat