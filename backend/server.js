const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000", // Replace with your frontend URL
      // "https://my-portfolio-one-cyan-47.vercel.app" // Replace with your actual Vercel domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

//connect to MongoDB
connectDB();

//Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
