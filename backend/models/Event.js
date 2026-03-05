const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  date: String,
  location: String,
  rsvpCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Event", eventSchema);