const express = require("express");
const { generateThumbnail } = require("../controllers/thumbnailController");
const Thumbnail = require("../models/Thumbnail");


const router = express.Router();

// Fetch the latest 6 thumbnails
router.get("/gallery", async (req, res) => {
    try {
        const thumbnails = await Thumbnail.find().sort({ createdAt: -1 }).limit(8);

        if (!thumbnails.length) {
            return res.json({ success: false, error: "No images found in the database." });
        }

        res.json({ success: true, thumbnails });
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        res.status(500).json({ success: false, error: "Failed to fetch gallery images" });
    }
});

router.post("/generate", generateThumbnail);


module.exports = router;
