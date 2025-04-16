//Profile Model
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      maxLength: 500,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    location: {
      city: String,
      state: String,
      zip: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    emailAddress: {
      type: String,
      default: "",
    },
    facebookLink: {
      type: String,
      default: "",
    },
    twitterLink: {
      type: String,
      default: "",
    },
    instagramLink: {
      type: String,
      default: "",
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
