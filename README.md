# 🖼️ AI Thumbnail Generator

An AI-powered web app that generates **YouTube-style thumbnails** 
from user inputs like title, actors, genre, and story — combining image generation, facial enhancement, background processing, and styled text overlays.

Designed to help YouTubers and content creators save time and boost creativity.

---

## 🌐 Live Demo

🚀 [Click here to try the app](https://thumbnail-frontend.onrender.com)

---

## 🧠 How It Works

1. User provides inputs: title, genre, actor names, short story
2. AI generates:
   - A relevant image (via API)
   - Background removed + enhanced face
   - Final thumbnail with text overlays
3. Thumbnail is displayed and saved to the gallery

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **CSS** 
- Responsive layout with modern UI

### Backend
- **Node.js + Express**
- AI integration for:
  - Image generation (via Hugging Face API)
  - Text overlays
  - Background removal
  - Image enhancement
- **MongoDB Atlas** to store recent thumbnails

---

## ✨ Features

- 📸 Generate thumbnails based on content
- 🧠 Uses AI for smart image generation
- 🖼️ Gallery with last 6 generated thumbnails
- 🕒 Each image includes timestamp
- 🔄 Automatically overlays title/genre
