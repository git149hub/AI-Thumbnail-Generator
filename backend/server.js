const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const thumbnailRoutes = require("./routes/thumbnailRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use(cors({
  origin: "http://localhost:3000", // Allow frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
  allowedHeaders: ["Content-Type"], // Allow content headers
}));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/thumbnails", thumbnailRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
