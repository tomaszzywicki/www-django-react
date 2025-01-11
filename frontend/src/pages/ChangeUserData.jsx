import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

import "../styles/ChangeUserData.css";
import { useNavigate } from "react-router-dom";

const ChangeUserData = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        try {
          const res = await api.get("/api/user/");
          setUserData({
            first_name: res.data.first_name || "",
            last_name: res.data.last_name || "",
            username: res.data.username || "",
            email: res.data.email || "",
          });
          setLoading(false);
        } catch (error) {
          console.log("Error when fetching user data: ", error);
          setError("Cannot fetch user data.");
          setLoading(false);
        }
      } else {
        console.log("No token");
        setError("No authentication token.");
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.put("/api/user/", userData);
      setSuccess("User data updated successfully.");
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } catch (err) {
      console.log("Error when updating user data: ", err);
      setError(
        err.response && err.response.data
          ? JSON.stringify(err.response.data)
          : "Unknown error occurred while updating user data."
      );
    }
  };

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="change-user-data-container">
      <h1 className="title">Change User Data</h1>
      {error && (
        <p className="error">
          Błąd: {typeof error === "string" ? error : "Unknown error."}
        </p>
      )}
      {success && <p className="success">{success}</p>}
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Second name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Update User Data
        </button>
      </form>
    </div>
  );
};

export default ChangeUserData;
