const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Profile = require("../models/profile.js");
const Listing = require("../models/listing.js");

const verifyToken = require("../middleware/verify-token");
const { profileUpload } = require('../middleware/upload');

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
    const userId = req.params.userId;

    if (req.user._id !== userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }

    // Prevent duplicate profile creation
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ err: "Profile already exists." });
    }

    // Create and save the new profile
    const newProfile = new Profile({
      ...req.body,
      user: userId,
    });

    const savedProfile = await newProfile.save();

    // Update the user to reference this new profile
    await User.findByIdAndUpdate(userId, { profile: savedProfile._id });

    // Return the newly created profile
    res.status(201).json({ profile: savedProfile });
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ err: err.message });
  }
});

// Show User and User profile
router.get("/:userId", verifyToken, async (req, res) => {
  try {

    // Find user and related data
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ err: "User not found." });
    }

    // Find profile separately
    const profile = await Profile.findOne({ user: req.params.userId });
    
    // Get user's listings
    const listings = await Listing.find({ author: req.params.userId });

    // Return full profile data to any authenticated user
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        profile: profile,
        listings: listings
      }
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Upload Profile Picture

//  with improved ID handling and debugging

router.post('/:userId/profile-picture', verifyToken, profileUpload.single('profilePicture'), async (req, res) => {
  try {
    
    // Compare as strings to ensure proper matching
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }
    
    if (!req.file) {
      return res.status(400).json({ err: "Please upload an image" });
    }
    
    // Get image URL path
    const profilePicture = `/uploads/profiles/${req.file.filename}`;
    console.log('Image path:', profilePicture);

    // Find profile first to debug
    const existingProfile = await Profile.findOne({ user: req.params.userId });
    console.log('Found profile?', !!existingProfile);
    
    if (!existingProfile) {
      // Create profile if it doesn't exist
      console.log('Creating new profile for user:', req.params.userId);
      const newProfile = new Profile({
        user: req.params.userId,
        profilePicture
      });
      const savedProfile = await newProfile.save();
      return res.json({ profile: savedProfile });
    }
    
    // Update existing profile
    existingProfile.profilePicture = profilePicture;
    await existingProfile.save();
    res.json({ profile: existingProfile });
    
  } catch (err) {
    console.error("Profile picture upload error:", err);
    res.status(500).json({ err: err.message });
  }
});


// Upload cover photo (similar to profile picture)

router.post('/:userId/cover-photo', verifyToken, profileUpload.single('coverPhoto'), async (req, res) => {
  try {
    // Similar implementation as profile picture
    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ err: "Unauthorized" });
    }
    
    // Remove this condition to allow any authenticated user to view profiles
    // if (req.user._id !== req.params.userId) {
    //   return res.status(403).json({ err: "Unauthorized" });
    // }


    if (!req.file) {
      return res.status(400).json({ err: "Please upload an image" });
    }

    const coverPhoto = `/uploads/profiles/${req.file.filename}`;
    
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { coverPhoto },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ err: "Profile not found" });
    }

    res.json({ profile });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});



module.exports = router;
