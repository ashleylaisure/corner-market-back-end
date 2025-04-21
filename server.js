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


// --- Recommended Detailed CORS Configuration ---
const allowedOrigins = [
  "https://corner-market.netlify.app", 'http://localhost:5173', 'http://localhost:3000',
  // Add local dev URL if needed: 'http://localhost:3000',
];
const corsOptions = {
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
      } else {
          console.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Explicitly allow methods including OPTIONS
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Allow common headers + Authorization
  credentials: true, // Allow credentials (cookies/auth headers)
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Apply detailed CORS options



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

// CRITICAL FIX FOR HEROKU: Use process.env.PORT
const PORT = process.env.PORT || 3000; // Use Heroku's port or 3000 locally
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}.`); // Log the correct port
});