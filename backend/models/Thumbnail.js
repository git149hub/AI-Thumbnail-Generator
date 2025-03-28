const mongoose = require("mongoose");

const ThumbnailSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  actors: { type: [String], required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } // ✅ Add timestamp
});

// Middleware to keep only the latest 6 thumbnails
ThumbnailSchema.pre("save", async function (next) {
  const count = await mongoose.model("Thumbnail").countDocuments();
  if (count >= 8) {
    await mongoose.model("Thumbnail").findOneAndDelete({}, { sort: { createdAt: 1 } });
  }
  next();
});

module.exports = mongoose.model("Thumbnail", ThumbnailSchema);
