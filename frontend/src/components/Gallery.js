import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Gallery.css";


const Gallery = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/thumbnails/gallery");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/thumbnails/gallery`);
        setThumbnails(response.data.thumbnails);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      {loading ? (
        <p>Loading...</p>
      ) : thumbnails.length > 0 ? (
        <div className="gallery-grid">
          {thumbnails.map((thumbnail) => (
            <div key={thumbnail._id} className="thumbnail-card">
              <img src={thumbnail.imageUrl} alt="Generated Thumbnail" className="thumbnail-image" />

              <a href={thumbnail.imageUrl} download={`thumbnail-${thumbnail._id}.jpg`}  className="download-btn">
                ⬇
                <span className="tooltip-text">Download Thumbnail</span>
              </a>

              <p>{thumbnail.movieName}</p>
              <small>{new Date(thumbnail.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      ) : (
        <p>No images found in the gallery.</p>
      )}



      
    </div>
  );
};

export default Gallery;
