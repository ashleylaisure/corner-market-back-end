const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const Listing = require("../models/listing.js");

//I.N.D.U.C.E.S.

// Index

// Delete

// Update

// Create

// Show Listing details
router.get("/:listingId", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate([
      "author",
    ]);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
