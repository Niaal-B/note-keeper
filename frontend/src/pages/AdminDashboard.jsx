import React, { useState, useEffect } from "react";
import "../styles/AdminDashboad.css"; // Fixed typo in filename
import api from "../api";
import { useNavigate } from "react-router-dom"; // Import for navigation

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 


  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");

    if (!token) {
      navigate("/admin/login"); 
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem("admin_access_token");
    api.get(`/api/admin/users/?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token"); 
    navigate("/admin/login"); 
  };


  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    const token = localStorage.getItem("admin_access_token");
    api.delete(`/api/admin/users/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      });
  };

  const startEditing = (user) => {
    setIsEditing(user.id);
    setEditUsername(user.username);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditUsername("");
  };

  const handleEdit = (userId) => {
    console.log(userId)
    const token = localStorage.getItem("admin_access_token");
  
    api.put(`/api/admin/users/${userId}/`, { username: editUsername }, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setUsers(prevUsers =>
          prevUsers.map(user => user.id === userId ? {...user,username:editUsername} : user)
        );
        setIsEditing(null);
        setEditUsername(""); 
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update user. Please try again.");
      });
  };
  

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Please fill all fields");
      return;
    }
    
    const token = localStorage.getItem("admin_access_token");
    api.post("/api/admin/users/", newUser, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsers([...users, res.data]);
        setNewUser({ username: "", email: "", password: "" });
        alert("User created successfully!");
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        alert("Failed to create user. Please try again.");
      });
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your users from this control panel</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="search-section card">
          <h2>Search Users</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by username or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>

        <div className="register-section card">
          <h2>Register New User</h2>
          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            
            <button type="submit" className="register-button">
              Register User
            </button>
          </form>
        </div>

        <div className="users-section card">
          <h2>User Management</h2>
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>No users found. Try a different search or add new users.</p>
            </div>
          ) : (
            <div className="user-list">
              <div className="user-list-header">
                <span className="col-username">Username</span>
                <span className="col-actions">Actions</span>
              </div>
              {users.map((user,idx) => (
                <div key={idx} className="user-item">
                  <div className="col-username">
                    {isEditing === user.id ? (
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{user.username}</span>
                    )}
                  </div>
                  <div className="col-actions">
                    {isEditing === user.id ? (
                      <div className="edit-actions">
                        <button onClick={() => handleEdit(user.id)} className="save-button">
                          Save
                        </button>
                        <button onClick={cancelEditing} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="user-actions">
                        <button onClick={() => startEditing(user)} className="edit-button">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="delete-button">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;