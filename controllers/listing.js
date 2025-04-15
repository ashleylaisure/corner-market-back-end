const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingUpload } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');


//I.N.D.U.C.E.S.

// Index
router.get("/", async (req, res) => {
    try {
        const listing = await Listing.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// Filter Index by category
router.get('/filter/:category', async (req, res) => {
    try {
        const { category } = req.params;

        const query = category ? { category: decodeURIComponent(category) } : {};

        const filteredListings = await Listing.find(query)
            .populate("author")
            .sort({createdAt: "desc"});

        if (!filteredListings) {
            return res.status(404).json({ error: "No listings Available" });
        }

        res.status(200).json(filteredListings)
    } catch (err) {
        res.status(500).json({err: err.message})
    }
})

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

// Delete a listing image
router.delete('/:listingId/images/:imageIndex', verifyToken, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            return res.status(404).json({ err: "Listing not found" });
        }

        // Check authorization
        if (listing.author.toString() !== req.user._id) {
            return res.status(403).json({ err: "Not authorized to update this listing" });
        }

        const imageIndex = parseInt(req.params.imageIndex);

        if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= listing.images.length) {
            return res.status(400).json({ err: "Invalid image index" });
        }

        // Grab the image info before removing it
        const [removedImage] = listing.images.splice(imageIndex, 1);
        await listing.save();

        // Build the absolute path to the file
        const imagePath = path.join(__dirname, '..', 'public', removedImage.path);

        // Attempt to delete the file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Failed to delete image file:", err.message);
               
            } else {
                console.log("✅ Deleted image file:", removedImage.filename);
            }
        });

        res.json(listing);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// UPDATE - Update listing details and optionally add images
router.put("/:id", verifyToken, listingUpload.array('images', 5), async (req, res) => {
    try {
        console.log("🗂 Uploaded Files:", req.files); 
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        if (listing.author.toString() !== req.user._id) return res.status(403).json({ error: "Unauthorized" });

        // Merge updates
        const updatableFields = ["title", "price", "category", "condition", "description", "location"];
        updatableFields.forEach((field) => {
            if (req.body[field]) listing[field] = req.body[field];
        });

        // Append new images if any
        if (req.files.length > 0) {
            const newImageObjects = req.files.map(file => ({
                filename: file.filename,
                path: `/uploads/listings/${file.filename}`,
                originalname: file.originalname
            }));
            listing.images.push(...newImageObjects);
        }

        await listing.save();
        console.log(" Saved listing:", listing);
        await listing.populate("author");
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE - Create new listing with images
router.post("/", verifyToken, listingUpload.array('images', 5), async (req, res) => {
    try {
        const imageObjects = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/listings/${file.filename}`,
            originalname: file.originalname
        }));
        const newListing = new Listing({
            ...req.body,
            images: imageObjects,
            author: req.user._id
        });
        await newListing.save();
        await newListing.populate("author");
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


// Upload multiple listing images

router.post('/:listingId/images', verifyToken, listingUpload.array('images', 5), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            return res.status(404).json({ err: "Listing not found" });
        }

        if (listing.author.toString() !== req.user._id) {
            return res.status(403).json({ err: "Not authorized to update this listing" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ err: "Please upload at least one image" });
        }

        const imageObjects = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/listings/${file.filename}`,
            originalname: file.originalname
        }));

        // Add new images to existing images array
        listing.images = [...listing.images, ...imageObjects];
        await listing.save();

        res.json(listing);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// Create
// router.post("/", verifyToken, async (req, res) => {
//     try {
//       req.body.author = req.user._id;
//       const listing = await Listing.create(req.body);

//       // Populate the author field before sending the listing back
//       await listing.populate('author');
//       res.status(201).json(listing);
//     } catch (err) {
//         console.error("🔥 Error creating listing:", err); // ✅ more helpful logging
//       res.status(500).json({ err: err.message });
//     }
//   });



//show

router.get("/:listingId", async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.listingId).populate({
        path: "author",
        populate: {
          path: "profile",
        },
      });
  
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
  
      res.status(200).json(listing);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  

module.exports = router;
