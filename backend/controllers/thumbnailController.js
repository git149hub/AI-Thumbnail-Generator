const Thumbnail = require("../models/Thumbnail");
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

exports.generateThumbnail = async (req, res) => {
  try {
    const { movieName, actors, genre, description } = req.body;

    const prompt = `A high-quality YouTube thumbnail for a movie titled "${movieName}". 
                    Genre: ${genre}. Main actors: ${actors.join(", ")}.
                    Description: ${description}. Cinematic, vibrant, and engaging.`;

    const imageBlob = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        negative_prompt: "low quality, blurry, pixelated",
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    console.log("🛠 Saving to MongoDB:", { movieName, actors, genre, description, imageUrl });

    const newThumbnail = new Thumbnail({
      movieName,
      actors,
      genre,
      description,
      imageUrl,
      createdAt: new Date()  // ✅ Ensure createdAt is set
    });
    console.log("✅ Saved successfully!");
    await newThumbnail.save();
    


    res.json({ success: true, data: newThumbnail });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    res.status(500).json({ success: false, error: "Failed to generate thumbnail" });
  }
};
