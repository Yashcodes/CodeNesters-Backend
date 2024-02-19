const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    required: true,
  },

  event: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
