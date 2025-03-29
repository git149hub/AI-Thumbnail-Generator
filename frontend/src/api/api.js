import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://thumbnail-generator-u0ue.onrender.com/api";

// Function to generate a new thumbnail
export const generateThumbnail = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/thumbnails/generate`, formData);
        return response.data;
    } catch (error) {
        console.error("Error generating thumbnail:", error);
        return { success: false, error: "Failed to generate thumbnail" };
    }
};

export const fetchGallery = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/thumbnails/gallery`);
        return response.data;
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return { success: false, thumbnails: [] };
    }
};
