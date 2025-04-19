// npm
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");
const path = require('path');

// Import routers
const authRouter = require("./controllers/auth");
const testJwtRouter = require("./controllers/test-jwt");
const usersRouter = require("./controllers/users");
const listingRouter = require("./controllers/listing.js");
const conversationsRouter = require("./controllers/conversations.js");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors({
  origin: "https://corner-market.netlify.app/",
  credentials: true
}));
app.use(express.json());
app.use(logger("dev"));

// Serve everything from /public at root (/)
app.use(express.static(path.join(__dirname, 'public')));

// Serve /uploads specifically from public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Routes
app.use("/auth", authRouter);
app.use("/test-jwt", testJwtRouter);
app.use("/users", usersRouter);
app.use("/listings", listingRouter);
app.use("/conversations", conversationsRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log("The express app is ready!");
});
