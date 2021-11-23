const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  roomName: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
