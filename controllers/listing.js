const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const Listing = require("../models/listing.js");

//I.N.D.U.C.E.S.

// Index
router.get('/', verifyToken, async (req, res) => {
    try {
        const listing = await Listing.find({}).populate("author").sort({ createdAt: "desc" });
    res.status(200).json(listing);

    } catch(err) {
        res.status(500).json({err : err.message})
    }
})

// Delete

// Update

// Create
router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const listing = await Listing.create(req.body)
        listing._doc.author = req.user;
        res.status(201).json(listing)

    } catch (err) {
        res.status(500).json({err: err.message})
    }
})

// Show

module.exports = router;
