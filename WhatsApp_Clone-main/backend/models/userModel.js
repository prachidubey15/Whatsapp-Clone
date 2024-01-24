const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true }, //email val
    password: { type: String, required: true, minlength: 8 },
    profilePic: {
      type: String,
      default: "0c7bba6cece54073fc486d84fe25297d.jpg",
    },
    about: { type: String, default: "Hey there, I am using whatsApp" },
    socketId: {
      type: String,
      default: "",
    },
    jwttoken: { type: String },
  },
  { timestamps: true }
);

//generate salt and hash of Password
userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const user = mongoose.model("User", userSchema);
module.exports = user;
