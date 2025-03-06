const mongoose = require("mongoose")

const profileDataSchema = new mongoose.Schema({
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
  const ProfileData = mongoose.model('ProfileData', profileDataSchema);

  module.exports = ProfileData;