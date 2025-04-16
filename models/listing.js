// listing Model
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Video Games",
        "Antiques & Collectables",
        "Arts & Crafts",
        "Auto Parts & Accessories",
        "Baby Products",
        "Books, Movies & Music",
        "Cell Phones & Accessories",
        "Clothing & Accessories",
        "Electronics",
        "Furniture",
        "Health & Beauty",
        "Home & Kitchen",
        "Jewelry & Watches",
        "Musical Instruments",
        "Office Supplies",
        "Patio & Garden",
        "Pet Supplies",
        "Sporting Goods",
        "Tools & Home Improvement",
        "Toys & Games",
        "Travel & Luggage",
        "Miscellaneous",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
    },
    location: {
      city: String,
      state: String,
      zip: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    images: [{
      filename: String,
      path: String,
      originalname: String
    }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
