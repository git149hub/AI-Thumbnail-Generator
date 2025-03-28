import React, { useState } from "react";
import axios from "axios";

const ThumbnailForm = ({ setGeneratedThumbnail }) => {
  const [formData, setFormData] = useState({
    movieName: "",
    actors: "",
    genre: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/thumbnails/generate", {
        movieName: formData.movieName,
        actors: formData.actors.split(","),
        genre: formData.genre,
        description: formData.description,
      });

      if (response.data.success) {
        setGeneratedThumbnail(response.data.data.imageUrl);
      } else {
        alert("Failed to generate thumbnail");
      }
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      alert("An error occurred while generating the thumbnail");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Generate Thumbnail</h2>
      <form onSubmit={handleSubmit}>
        <label>Movie Name:</label>
        <input type="text" name="movieName" value={formData.movieName} onChange={handleChange} required />

        <label>Actors (comma separated):</label>
        <input type="text" name="actors" value={formData.actors} onChange={handleChange} required />

        <label>Genre:</label>
        <input type="text" name="genre" value={formData.genre} onChange={handleChange} required />

        <label>Story:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <button type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Thumbnail"}</button>
      </form>
    </div>
  );
};

export default ThumbnailForm;
