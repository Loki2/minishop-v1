const mongoose = require("mongoose");
const { roles } = require("../utils/constant");

const userSchema = new mongoose.Schema(
  {
    //***************** User Basic Information *********************/
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },     //************ System Auth information *************/
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: [roles.admin, roles.manager, roles.user],
      default: roles.user,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordTokenExpiry: {
      type: Number,
      default: 0,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;