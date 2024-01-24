const User = require("../models/userModel");
const Chat = require('../models/chatModel');
const generateToken = require("../utils/generateToken");

const mongoose = require('mongoose');
const Grid = require("gridfs-stream");


const mongoURI = process.env.MONGO_URI;

//connection
const conn = mongoose.createConnection(mongoURI);
//gfs stream
let gfs;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
   gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
     bucketName: "uploads",
   });
});

const signinController = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    if (!userName || !password || !email || password.length < 8) {
      res.status(400).json("Fill all the details");
    }
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      res.status(403).json("Email already registered!!");
    } else {
      const createdUser = await User.create({
        userName,
        password,
        email,
        jwttoken: generateToken({ email }),
      });
      //delete password property from createdUser
      res.status(201).json({
        _id: createdUser._id,
        userName: createdUser.userName,
        email,
        jwttoken: createdUser.jwttoken,
        profilePic: createdUser.profilePic,
      });
    }
  } catch (error) {
    return error;
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user && (await user.comparePassword(password))) {
      const newToken = generateToken({ email });
      user.jwttoken = newToken;
      await user.save();
      res.status(202).json({
        _id: user._id,
        userName: user.userName,
        email,
        jwttoken: user.jwttoken,
        profilePic: user.profilePic,
        about:user.about,
      });
    } else {
      res.status(401).json("Invalid Credentials");
    }
  } catch (error) {
    return error;
  }
};

const searchUserController = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { userName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const result = await User.find(keyword, "-password").find({
      email: { $ne: req.user.email },
    });
    res.json(result);
  } catch (error) {
    res.send(error);
  }
};

const allUserController = async (req, res) => {
  try {
    const result = await User.find({},'-password').find({
      email: { $ne: req.user.email },
    });
    res.json(result);
  } catch (error) {
    res.send(error);
  }
};

const changeDpController = async (req,res)=>{
  const {userId} = req.params
  // console.log(req.file);

  try {
    let prevDp = await User.findById(userId);
    prevDp = prevDp.profilePic;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: req.file.filename,
      },
      { new: true }
    );
    if (prevDp !== "0c7bba6cece54073fc486d84fe25297d.jpg") {
      const file = await gfs.files.findOne({
        filename: prevDp,
      });
      const deletedDp = await gfsBucket.delete(file._id);
      console.log(deletedDp);
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("error");
    return error
  }
};

const showDp = async(req,res)=>{
  const {fileName} = req.params
  try {
    gfsBucket.openDownloadStreamByName(fileName).pipe(res);
  } catch (error) {
    return error
  }
}

const updateDetailsController = async(req,res)=>{
  const {userName,about} = req.body;
  const update = userName?{userName}:{about};
  try {
    const user = await User.findByIdAndUpdate(req.user._id,update,{new:true});
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const changeGroupDp = async (req, res) => {
  const { chatId } = req.params;
  // console.log(req.file);

  try {
    let prevDp = await Chat.findById(chatId);
    prevDp = prevDp.chatDp;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatDp: req.file.filename,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (prevDp !== "d8ebacdacf7d2979587e432214f5db65.png") {
      const file = await gfs.files.findOne({
        filename: prevDp,
      });
      const deletedDp = await gfsBucket.delete(file._id);
      console.log(deletedDp);
    }
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return error;
  }

};
module.exports = {
  signinController,
  loginController,
  searchUserController,
  allUserController,
  changeDpController,
  showDp,
  updateDetailsController,
  changeGroupDp
};
