const Thumbnail = require("../models/Thumbnail");
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

exports.generateThumbnail = async (req, res) => {
  try {
    const { movieName, actors, genre, description } = req.body;

    /* ---------------- OLD PROMPT ---------------- */
    
    // const prompt = `A high-quality YouTube thumbnail for a movie titled "${movieName}". 
    //                 Genre: ${genre}. Main actors: ${actors.join(", ")}.
    //                 Description: ${description}. Cinematic, vibrant, and engaging.`;
    

    /* ---------------- MOVIE PROMPT ---------------- */

    const moviePrompt = `
    Ultra realistic cinematic movie thumbnail, professional film lighting,
    sharp focus, high contrast, dramatic shadows, shallow depth of field,
    8k detailed, hyper realistic skin texture, cinematic color grading.

    Main subject: ${actors.join(", ")} as powerful expressive characters.
    Movie title theme: ${movieName}
    Genre style: ${genre}

    Scene mood and story:
    ${description}

    Epic cinematic poster composition,
    Multiple main characters arranged in cinematic poster layout,
    dramatic action filled background, cinematic wide framing,
    dust, fire, smoke, glowing light rays,
    promotional blockbuster movie poster style.
    `;

    /* ---------------- CREATOR PROMPT ---------------- */

    const creatorPrompt = `
    Ultra realistic cinematic YouTube thumbnail,
    close-up expressive human face, dramatic lighting,
    high contrast, sharp focus, professional color grading,
    viral thumbnail composition.

    Main subject: a powerful expressive person related to the topic.
    Emotion: shocked, excited, intense, curious.

    Video topic:
    ${description}

    Clean glowing background, strong subject separation,
    rim light around face, shallow depth of field,
    hyper realistic skin texture, 8k detailed, eye-catching.
    `;

    /* ---------------- SMART PROMPT SWITCH ---------------- */

    let prompt;

    if (actors && actors.length > 0) {
      prompt = moviePrompt;       // Movie style
    } else {
      prompt = creatorPrompt;     // Creator style
    }

    const imageBlob = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry, low resolution, cartoon, anime, painting, sketch, distorted face, extra fingers, extra limbs, bad anatomy, washed out colors, low contrast, watermark, text",
        num_inference_steps: 35,
        guidance_scale: 8.5,
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
