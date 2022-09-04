const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotification: {
      type: Array,
      default: [],
    },
    unSeenNotification: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("users", userSchema);
