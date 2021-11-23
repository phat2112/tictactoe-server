const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  personJoined: {
    type: [String],
    require: true,
  },
});

const Rooms = mongoose.model("rooms", roomSchema);
module.exports = Rooms;
