import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

import "../styles/ChangeUserPassword.css";

const ChangeUserPassword = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [passwords, setPasswords] = useState({
    password: "",
    password2: "",
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
          setUser(res.data);
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
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Walidacja wstępna
    if (passwords.password !== passwords.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.put("/api/user/", {
        password: passwords.password,
        password2: passwords.password2,
        username: user.username,
      });
      setSuccess("Password changed successfully.");
      setPasswords({
        password: "",
        password2: "",
      });
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    } catch (error) {
      console.error("Error changing password: ", error);
      setError(
        error.response && error.response.data
          ? error.response.data.detail || "Failed to change password."
          : "Failed to change password."
      );
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="change-password-container">
      <Navbar />
      <h2>Change Password</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form className="change-password-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={passwords.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm New Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={passwords.password2}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangeUserPassword;
