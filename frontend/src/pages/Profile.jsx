import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css"

const ProfilePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileName, setFileName] = useState("No file chosen");

  useEffect(() => {
    // Fetch the existing profile picture when the component loads
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        setProfilePic(response.data.profile_picture);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setError("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setProfilePic(response.data.data.profile_picture);
      setSuccess("Profile picture updated successfully!");
      setLoading(false);
    } catch (err) {
      setError("Failed to upload. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
      </div>

      <div className="profile-picture-container">
        {profilePic ? (
          <img
            src={`http://127.0.0.1:8000${profilePic}`}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture-placeholder">
            <span>?</span>
          </div>
        )}
      </div>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-container">
          <input
            type="file"
            id="file"
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
          />
          <label htmlFor="file" className="file-input-label">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Choose a file
          </label>
          <div className="file-name">{fileName}</div>
        </div>

        <button type="submit" className="upload-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Uploading...
            </>
          ) : (
            "Upload Profile Picture"
          )}
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
};

export default ProfilePage;