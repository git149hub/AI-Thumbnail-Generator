// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/Gallery.css";


// const Gallery = () => {
//   const [thumbnails, setThumbnails] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchGallery = async () => {
//       try {
//         // const response = await axios.get("http://localhost:5000/api/thumbnails/gallery");
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/thumbnails/gallery`);
//         setThumbnails(response.data.thumbnails);
//       } catch (error) {
//         console.error("Error fetching gallery images:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchGallery();
//   }, []);

//   return (
//     <div className="gallery-container">
//       <h2>Gallery</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : thumbnails.length > 0 ? (
//         <div className="gallery-grid">
//           {thumbnails.map((thumbnail) => (
//             <div key={thumbnail._id} className="thumbnail-card">
//               <img src={thumbnail.imageUrl} alt="Generated Thumbnail" className="thumbnail-image" />

//               <a href={thumbnail.imageUrl} download={`thumbnail-${thumbnail._id}.jpg`}  className="download-btn">
//                 ⬇
//                 <span className="tooltip-text">Download Thumbnail</span>
//               </a>

//               <p>{thumbnail.movieName}</p>
//               <small>{new Date(thumbnail.createdAt).toLocaleString()}</small>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No images found in the gallery.</p>
//       )}



      
//     </div>
//   );
// };

// export default Gallery;


import React, { useState, useEffect } from "react";
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

  const [recentThumbnails, setRecentThumbnails] = useState([]);

  // FETCH RECENT THUMBNAILS
  useEffect(() => {

    const fetchRecentThumbnails = async () => {
      try {

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/thumbnails/gallery`
        );

        const latestThumbnails = response.data.thumbnails.slice(0, 4);

        setRecentThumbnails(latestThumbnails);

      } catch (error) {
        console.error("Error fetching thumbnails:", error);
      }
    };

    fetchRecentThumbnails();

  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError(null);
    setThumbnail(null);

    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/thumbnails/generate`,
        {
          movieName: formData.movieName,
          actors: formData.actors
            .split(",")
            .map((actor) => actor.trim()),

          genre: formData.genre,
          description: formData.description,
        }
      );

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

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-left">

          <h1>
            AI-Powered <span>Thumbnail Generator</span>
          </h1>

          <p>
            Create eye-catching, high-converting thumbnails
            for your YouTube videos in seconds.
          </p>

          <div className="feature-badges">

            <div className="badge">
              ⚡ AI-Powered
            </div>

            <div className="badge">
              🎨 High Quality
            </div>

            <div className="badge">
              🚀 Lightning Fast
            </div>

          </div>

        </div>

        <div className="hero-right">

          <img
            src="/images/hero-banner.png"
            alt="AI Thumbnail Generator"
          />

        </div>

      </section>

      {/* RECENT GENERATES */}
      <section className="recent-section">

        <div className="section-header">
          <h2>Recent Generates</h2>
        </div>

        <div className="recent-grid">

          {recentThumbnails.map((thumbnail) => (

            <div
              key={thumbnail._id}
              className="recent-card"
            >

              <img
                src={thumbnail.imageUrl}
                alt={thumbnail.movieName}
              />

              <div className="recent-info">

                <h4>
                  {thumbnail.movieName}
                </h4>

                <p>
                  {new Date(
                    thumbnail.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* GENERATOR SECTION */}
      <section className="generator-section">

        <div className="generator-card">

          <h2>
            Generate Your Thumbnail
          </h2>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="thumbnail-form"
          >

            <div className="input-group">

              <label>Movie Name</label>

              <input
                placeholder="e.g., Inception"
                type="text"
                name="movieName"
                value={formData.movieName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <label>Genre</label>

              <input
                placeholder="e.g., Action, Sci-Fi"
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <label>Actors</label>

              <input
                placeholder="e.g. Leonardo DiCaprio, Tom Hardy"
                type="text"
                name="actors"
                value={formData.actors}
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <label>Movie Description</label>

              <textarea
                placeholder="Enter short story summary..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>

            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "Generate Thumbnail"}
            </button>

          </form>

        </div>

      </section>

      {/* GENERATED RESULT */}
      {thumbnail && (

        <section className="result-section">

          <h2>
            Generated Thumbnail
          </h2>

          <div className="thumbnail-container">

            <img
              src={thumbnail}
              alt="Generated Thumbnail"
              className="thumbnail-image"
            />

            <a
              href={thumbnail}
              download="thumbnail.png"
              className="generate-download-btn"
            >
              ⬇ Download
            </a>

          </div>

        </section>
      )}

    </div>
  );
};

export default GenerateThumbnail;
