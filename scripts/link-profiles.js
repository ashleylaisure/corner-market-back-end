// This script was used to link existing users to their profile documents
// Run once only after initial user profiles were created without references
// Safe to delete after all users have been updated


const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");
const Profile = require("../models/profile");

async function linkProfilesToUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const users = await User.find();
    for (let user of users) {
      const profile = await Profile.findOne({ user: user._id });
      if (profile && !user.profile) {
        await User.findByIdAndUpdate(user._id, { profile: profile._id });
      }
    }
    process.exit();
  } catch (err) {
    console.error(" Error linking profiles:", err);
    process.exit(1);
  }
}

linkProfilesToUsers();
