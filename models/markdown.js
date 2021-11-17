const mongoose = require("mongoose");

const markdownListSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  step: {
    type: [Number, Number],
    require: true,
  },
  room: {
    type: String,
    require: true,
  },
});

const MarkDowns = mongoose.model("markDowns", markdownListSchema);
module.exports = MarkDowns;
