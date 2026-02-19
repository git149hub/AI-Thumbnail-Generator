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
    Ultra realistic cinematic movie thumbnail, professional film lighting,
    sharp focus, high contrast, dramatic shadows, shallow depth of field,
    8k detailed, hyper realistic skin texture, cinematic color grading.

    A high-quality YouTube thumbnail for a movie titled "${movieName}". 
    Genre: ${genre}. Main actors: ${actors.join(", ")}.
    Description: ${description}. Cinematic, vibrant, and engaging.

    Epic background environment with action, fire, smoke, glowing light rays,
    layered depth composition, promotional theatrical poster style.
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
