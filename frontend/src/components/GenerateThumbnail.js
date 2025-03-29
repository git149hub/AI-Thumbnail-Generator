import React, { useState } from "react";
import axios from "axios";
import "../styles/GenerateThumbnail.css";


const GenerateThumbnail = () => {
  const [formData, setFormData] = useState({
    movieName: "",
    actors: "",
    genre: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setThumbnail(null);

    try {
      // const response = await axios.post("http://localhost:5000/api/thumbnails/generate", {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/thumbnails/generate`, {
        movieName: formData.movieName,
        actors: formData.actors.split(",").map((actor) => actor.trim()),
        genre: formData.genre,
        description: formData.description,
      });

      if (response.data.success) {
        setThumbnail(response.data.data.imageUrl);
      } else {
        setError("Failed to generate thumbnail");
      }
    } catch (err) {
      setError("Error generating thumbnail. Please try again.");
    }
    setLoading(false);
  };

  return (

    <div className="main-container">
      {/* Top Section: Text + Form */}
      <div className="homepage-container">
        <div className="left-section">
          <h1>Welcome to the Thumbnail Generator</h1>
          <p>Generate AI-powered thumbnails here.</p>
        </div>
        {error && <p className="error-message">{error}</p>}

        <div className="right-section">
          <form onSubmit={handleSubmit} className="thumbnail-form">
            <label>Movie Name:</label>
            <input
              placeholder="e.g., Inception"
              type="text"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              required
            />

            <label>Genre:</label>
            <input
              placeholder="e.g., Action, Sci-Fi"
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            />

            <label>Actors:</label>
            <input
              placeholder="e.g. Leonardo DiCaprio, Tom Hardy"
              type="text"
              name="actors"
              value={formData.actors}
              onChange={handleChange}
              required
            />

            <label>Movie Description:</label>
            <textarea
              placeholder="Enter short story summary..."
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Thumbnail"}
            </button>
          </form>
        </div>
      </div>

      {thumbnail && (
        <div className="thumbnail-preview">
          <h3>Generated Thumbnail:</h3>
          <div className="thumbnail-container">
            <img src={thumbnail} alt="Generated Thumbnail" className="thumbnail-image" />
            <a href={thumbnail} download="thumbnail.png" className="generate-download-btn">⬇</a>
          </div>
        </div>
      )}



    </div>

  );
};

export default GenerateThumbnail;
