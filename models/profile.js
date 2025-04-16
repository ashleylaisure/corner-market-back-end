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
      type: String,
      trim: true,
      default: "",
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
