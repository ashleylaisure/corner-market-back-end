const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Profile = require("../models/profile");

const saltRounds = 12;

router.post("/sign-up", async (req, res) => {
  try {
    // const userInDatabase = await User.findOne({ username: req.body.username });

    // making the search case insestive
    const userInDatabase = await User.findOne({
      username: { $regex: new RegExp(`${req.body.username}$`, "i") },
    });

    if (userInDatabase) {
      return res.status(409).json({ err: "Username already taken." });
    }

    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
    });

    const profile = await Profile.create({
      user: user._id,
      memberSince: Date.now(),
    });
    const savedProfile = await profile.save();

    user.profile = savedProfile._id;
    await user.save();

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        profile: savedProfile,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.hashedPassword
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials." });
    }

    const payload = { username: user.username, _id: user._id };

    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
