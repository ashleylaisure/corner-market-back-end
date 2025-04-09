const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const Listing = require("../models/listing.js");

//I.N.D.U.C.E.S.

// Index
router.get("/", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete
// Deletes a specific listing by ID
// Requires authentication and authorization (only listing owner can delete)
// Returns 200 status with success message if deleted successfully
// Returns 404 if listing not found, 403 if unauthorized, 500 for server errors

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    if (listing.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this listing!" });
    }
    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Check authorization
    if (listing.author.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this listing" });
    }

    // Update listing with request body data
    Object.assign(listing, req.body);

    await listing.save();

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const listing = await Listing.create(req.body);
    listing._doc.author = req.user;
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//show

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
