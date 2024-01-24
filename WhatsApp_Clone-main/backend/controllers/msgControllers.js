const Message = require("../models/messageModel.js");
const Chat = require("../models/chatModel.js");

const readAllMsg = async (req, res) => {
  const { chatId } = req.params;
  try {
    const allMsgs = await Message.find({ chat: chatId })
      .populate({
        path: "sender",
        select: "userName profilePic",
      })
      .populate("chat");
    res.status(200).json(allMsgs);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const createNewMsg = async (req, res) => {
  const { chat, content } = req.body;
  const newMsg = {
    sender: req.user._id,
    content,
    chat,
  };
  try {
    const msg = await Message.create(newMsg);

    const latestMsg = await Chat.findByIdAndUpdate(
      chat,
      {
        latestMessage: msg._id,
      },
      { new: true }
    );
    const createdMsg = await Message.findById(msg._id)
      .populate({
        path: "sender",
        select: "userName profilePic",
      })
      .populate({
        path: "chat",
        populate: {
          path: "latestMessage users",
          select: "-password -jwttoken",
        },
      });
    res.status(201).json(createdMsg);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { createNewMsg, readAllMsg };
