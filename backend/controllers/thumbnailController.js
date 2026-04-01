const Thumbnail = require("../models/Thumbnail");
const { HfInference } = require("@huggingface/inference");
const OpenAI = require("openai");
require("dotenv").config();

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateThumbnail = async (req, res) => {
  try {
    const { movieName, actors, genre, description } = req.body;

    /* ---------------- OLD PROMPT ---------------- */
    
    // const prompt = `A high-quality YouTube thumbnail for a movie titled "${movieName}". 
    //                 Genre: ${genre}. Main actors: ${actors.join(", ")}.
    //                 Description: ${description}. Cinematic, vibrant, and engaging.`;
    

    /* ---------------- MOVIE PROMPT ---------------- */

    const moviePrompt = `
      A cinematic YouTube thumbnail of a movie titled "${movieName}".

      Main subjects: ${actors.join(", ")}, highly detailed faces, expressive emotions, sharp focus.

      Scene: ${description}

      Environment: ${genre} themed background, dramatic lighting, fire, smoke, glowing effects, depth and atmosphere.

  Composition:
    - Close-up or mid-shot
    - Rule of thirds
    - Clear subject focus
    - Blurred background (depth of field)

    Style:
     - Ultra realistic
     - Cinematic movie poster style
     - High contrast lighting
     - Vibrant colors
     - HDR, 4K quality

    Text:
    - Bold title "${movieName}" in large cinematic font
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

    const prompt = actors.length > 1 ? moviePrompt : creatorPrompt;

    let imageUrl;

     /* ---------------- TRY OPENAI FIRST ---------------- */


    try {
      const openaiResult = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024",
      });

      const openaiBase64 = openaiResult.data[0].b64_json;
      imageUrl = `data:image/png;base64,${openaiBase64}`;

      console.log("🔥 Image generated using OpenAI");

    } catch (openaiError) {

      console.log("⚠️ OpenAI failed — switching to HuggingFace");

       /* ---------------- HUGGINGFACE BACKUP ---------------- */

    const imageBlob = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry, low resolution, cartoon, anime, painting, sketch, distorted face, extra fingers, extra limbs, bad anatomy, washed out colors, low contrast",
        num_inference_steps: 35,
        guidance_scale: 8.5,
      },
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    imageUrl = `data:image/jpeg;base64,${base64Image}`;
    console.log("🟢 Image generated using HuggingFace");
    }  

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
