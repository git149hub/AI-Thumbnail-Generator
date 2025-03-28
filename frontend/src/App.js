import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GenerateThumbnail from "./components/GenerateThumbnail";

import Gallery from "./components/Gallery";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<GenerateThumbnail />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
