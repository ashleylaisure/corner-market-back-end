//Profile Model
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      maxLength: 500,
    },
    profilePicture: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    emailAddress: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    averageRating: {
      type: Number,
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
