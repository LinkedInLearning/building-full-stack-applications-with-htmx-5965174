const mongoose = require("mongoose")

const formDataSchema = new mongoose.Schema({
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String
    },
    address: {
      street: String,
      city: String,
      zip: String
    },
    preferences: {
      newsletter: Boolean,
      notifications: Boolean
    }
  });
  const FormData = mongoose.model('FormData', formDataSchema);

  module.exports = FormData;