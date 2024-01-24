const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");
const { findIndexOfObject } = require("../utils/findIndex.js");
const { gfs } = require("./userControllers.js");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  const logedinUserId = req.user._id;
  try {
    if (!userId) {
      return res.status(400).json("UserId was not sent with request");
    }

    var isChat = await Chat.find({
      inGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: logedinUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "userName, email, profilePic",
    });
  } catch (error) {
    res.status(400).json(error.message);
  }

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [logedinUserId, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const newChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(newChat);
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "userName, email, profilePic",
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const searchChat = async (req, res) => {
  const keyword = req.query.search
    ? [
        { users: { $in: { userName: req.query.search }, $options: "i" } },
        { chatName: { $regex: req.query.search, $options: "i" } },
      ]
    : {};
  const logedInUser = req.user._id;
  try {
    const searchGroup = await Chat.find(keyword[1])
      .populate("users", "-password")
      .populate("latestMessage");

    const searchChats = await Chat.find({})
      .populate("users", "-password")
      .populate("latestMessage");
    const matchChats = searchChats.filter((chat) => {
      if (!chat.inGroupChat) {
        const findSender = (users, loggedInUser) =>
          String(users[0]._id) === String(loggedInUser) ? users[1] : users[0];
        const sender = findSender(chat.users, logedInUser);
        // console.log(sender);
        if (
          sender.userName.toLowerCase().includes(req.query.search.toLowerCase())
        ) {
          return chat;
        }
      }
    });
    const allMatch = [...searchGroup, ...matchChats];
    res.json(allMatch);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const createGroup = async (req, res) => {
  let { users, groupName } = req.body;
  if (!users || !groupName) {
    return res.status(400).json("Please fill all the fields");
  }

  users = JSON.parse(users);

  if (users.length < 2) {
    return res
      .status(400)
      .json("More than 2 users are required for create a Group");
  }

  users.push(req.user);
  try {
    const createdGroup = await Chat.create({
      chatName: groupName,
      chatDp:req.file.filename,
      users: users,
      inGroupChat: true,
      groupAdmin: [req.user._id],
    });

    const groupChat = await Chat.findOne({ _id: createdGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).send(groupChat);
  } catch (error) {
    res.status(400).json(error.message);
  }
  // res.json(groupName)
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const newName = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!newName) {
      return res.status(404).json("Chat Not Found");
    }
    res.send(newName);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const exitGroup = async (req, res) => {
  const { chatId } = req.params;
  const loggedInUserID = req.user._id;
  try {
    let group = await Chat.findById(chatId)
      .populate("users",'-password')
      .populate("groupAdmin","-password");

    const { groupAdmin, users } = group;

    const isAdmin = findIndexOfObject(groupAdmin, loggedInUserID);

    if (isAdmin === -1) {
      const index = findIndexOfObject(users, loggedInUserID);
      index > -1 ? users.splice(index, 1) : "";
      const updatedGroup = await Chat.findByIdAndUpdate(
        chatId,
        { users: users },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage");

      res.status(202).send(updatedGroup);
    } else {
      if (groupAdmin.length < 2) {
        res.status(400).json("Create another admin for exit group");
      } else {
        const indexAdmin = findIndexOfObject(groupAdmin, loggedInUserID);
        const indexUsers = findIndexOfObject(users, loggedInUserID);

        indexUsers > -1 ? users.splice(indexUsers, 1) : null;
        indexAdmin > -1 ? groupAdmin.splice(indexAdmin, 1) : null;

        const updatedGroup = await Chat.findByIdAndUpdate(
          chatId,
          { users: users, groupAdmin: groupAdmin },
          { new: true }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage");
        res.status(202).send(updatedGroup);
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const addToGroup = async (req, res) => {
  const { participants } = req.body;
  const { chatId } = req.params;
  const participant = JSON.parse(participants);

  try {
    const addedUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: [...participant] } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    addedUser
      ? res.status(200).json(addedUser)
      : res.status(404).json("Chat Not Found");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const removeFromGroup = async (req, res) => {
  const { userId } = req.body;
  const { chatId } = req.params;

  try {
    const deletedUser = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: { $in: userId }, groupAdmin: { $in: userId } } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    deletedUser
      ? res.status(200).json(deletedUser)
      : res.status(404).json("Chat Not Found");
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const addGroupAdmin = async (req, res) => {
  const { chatId } = req.params;
  const { newAdminId } = req.body;
  try {
    const details = await Chat.findById(chatId);
    const { groupAdmin } = details;
    const isAdmin = findIndexOfObject(groupAdmin, newAdminId);
    if (isAdmin === -1) {
      const group = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { groupAdmin: newAdminId },
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate('groupAdmin',"-password")
        .populate("latestMessage");
      res.status(202).send(group);
    } else {
      res.json("Already Admin");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteGroup = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat.isGroupChat) {
      const found = findIndexOfObject(chat.users, req.user);
      if (found !== -1 && chat.users.length < 2) {
        await db.Chat.deleteOne({ _id: chatId });
        res.status(202).json("Chat Deleted");
      } else if (found !== -1) {
        const newUsers = chat.users.splice(found, 1);
      } else {
        res.status(405).json("Not Allowed");
      }
    } else {
      res.status(405).json("Not Allowed to delete group");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const dismissGroupAdmin = async (req, res) => {
  const { chatId } = req.params;
  const { adminId } = req.body;
  try {
    const group = await Chat.findById(chatId);
    const { groupAdmin } = group;
    if (groupAdmin.length < 2) {
      res.status(200).json("Need to create new Admin first");
    } else {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { groupAdmin: { $in: adminId } } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage");
      res.status(202).json(chat);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};


module.exports = {
  accessChat,
  fetchChats,
  searchChat,
  createGroup,
  renameGroup,
  exitGroup,
  addToGroup,
  removeFromGroup,
  addGroupAdmin,
  deleteGroup,
  dismissGroupAdmin,
};
