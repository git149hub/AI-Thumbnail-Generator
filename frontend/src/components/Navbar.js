// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/Navebar.css"; // Make sure you have this file

// const Navbar = () => {
//   // return (
//   //   <nav className="navbar">
//   //     <h2>Thumbnail Generator</h2>
//   //     <ul>
//   //       <li><Link to="/">Home</Link></li>
//   //       <li><Link to="/gallery">Gallery</Link></li>
//   //     </ul>
//   //   </nav>
//   // );
//   return (
//     <nav className="navbar">
//       <div className="logo">🎬 Thumbnail Generator</div>
//       <div className="nav-links">
//         <Link to="/" className="nav-button">Home</Link>
//         <Link to="/gallery" className="nav-button">Gallery</Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navebar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">🎬</span>
        <span className="logo-text">ThumbGen AI</span>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={`nav-button ${
            location.pathname === "/" ? "active-nav" : ""
          }`}
        >
          Home
        </Link>

        <Link
          to="/gallery"
          className={`nav-button ${
            location.pathname === "/gallery" ? "active-nav" : ""
          }`}
        >
          Gallery
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
