import { useState, useEffect } from "react";
import api from "../api";
import Notes from "../components/Notes";
import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    getNote();
    fetchProfilePicture();
  }, [isAuthenticated, navigate]);

  const fetchProfilePicture = async () => {
    try {
      const response = await api.get("/api/profile/");
      setProfilePic(response.data.profile_picture);
    } catch (err) {
      console.error("Error fetching profile picture:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const getNote = () => {
    api.get("/api/notes")
      .then((res) => {
        console.log("Response:", res);
        return res.data;
      })
      .then((data) => {
        console.log("Data:", data);
        setNotes(data);
      })
      .catch((err) => {
        console.error("Error:", err.response ? err.response.data : err.message);
        alert("Error fetching notes!");
      });
  };

  const deleteNote = (id) => {
    api.delete(`/api/notes/delete/${id}/`).then((res) => {
      if (res.status === 204) console.log("Note Deleted");
      else alert("Failed to Delete Note");
      getNote();
    }).catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { content, title }).then((res) => {
      if (res.status === 201) console.log("Note Createad");
      else alert("Failed to Make Note");
      getNote();
      setContent("");
      setTitle("");
    }).catch((err) => alert(err));
  };

  return (
    <div className="home-container">
      <div className="header">
        <div className="user-info">
          {profilePic ? (
            <img
              src={`http://127.0.0.1:8000${profilePic}`}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">
              <span>{user?.username?.charAt(0).toUpperCase() || "?"}</span>
            </div>
          )}
          <h2 className="user-greeting">
            Welcome, <span>{user ? user.username : "Guest"}</span>
          </h2>
        </div>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={navigateToProfile}>
            My Profile
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="notes-section">
        <h2 className="section-title">Your Notes</h2>
        <div className="notes-list">
          {notes.map((note) => (
            <Notes note={note} onDelte={deleteNote} key={note.id} />
          ))}
        </div>
      </div>

      <div className="note-form">
        <h2 className="form-title">Create a New Note</h2>
        <form onSubmit={createNote}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
            ></textarea>
          </div>
          <input type="submit" value="Create Note" className="submit-btn" />
        </form>
      </div>
    </div>
  );
}

export default Home;