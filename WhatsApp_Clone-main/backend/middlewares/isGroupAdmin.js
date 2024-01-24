const Chat = require('../models/chatModel.js');
const { findIndexOfObject } = require('../utils/findIndex.js');


const isGroupAdmin = async(req,res,next)=>{
    const {chatId} = req.params ;
    try {
        const group = await Chat.findById(chatId);
        const isAdmin = findIndexOfObject(group.groupAdmin,req.user._id);
        isAdmin !== -1 ? next() : res.json("Admin Access Only");
    } catch (error) {
        res.status(400).json(error.message);
    }

}

module.exports = isGroupAdmin;