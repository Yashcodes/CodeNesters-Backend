const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  services: {
    type: Array,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
