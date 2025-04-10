const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Profile = require("../models/profile.js");

const verifyToken = require("../middleware/verify-token");

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//Update Users Profile
router.put("/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ err: "Profile not found." });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      req.body,
      { new: true }
    );

    // Ensure user points to this updated profile
    await User.findByIdAndUpdate(userId, { profile: updatedProfile._id });

    res.json({ profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create Users Profile
router.post("/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ err: "Profile already exists." });
    }

    const newProfile = new Profile({
      ...req.body,
      user: userId,
    });

    const savedProfile = await newProfile.save();

    await User.findByIdAndUpdate(userId, { profile: savedProfile._id });

    res.status(201).json({ profile: savedProfile });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Show User and User profile
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    // Remove this condition to allow any authenticated user to view profiles
    // if (req.user._id !== req.params.userId) {
    //   return res.status(403).json({ err: "Unauthorized" });
    // }

    const user = await User.findById(req.params.userId).populate("profile");

    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
