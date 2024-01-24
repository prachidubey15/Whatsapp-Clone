const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    inGroupChat: { type: Boolean, default: false },
    chatDp: {
      type: String,
      default: "d8ebacdacf7d2979587e432214f5db65.png",
    },
    blockedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
