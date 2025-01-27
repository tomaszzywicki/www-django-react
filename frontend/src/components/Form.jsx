/* eslint-disable react/prop-types */
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import Loading from "./Loading";

const Form = ({ route, method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (method === "register") {
      if (!email) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          newErrors.email = "Invalid email format";
        }
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Log validation state
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    if (!validate()) {
      return; // Don't reset form on validation failure
    }

    setLoading(true);

    try {
      const endpoint = route.endsWith("/") ? route : `${route}/`;
      const payload =
        method === "register"
          ? {
              username,
              password,
              password2: confirmPassword, // Add password confirmation to payload
              email,
            }
          : { username, password };

      console.log("Sending payload:", payload); // Debug payload

      const res = await api.post(endpoint, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data); // Debug error response

      if (error.response?.data) {
        const backendErrors = error.response.data;
        const newErrors = {};

        // Handle nested error messages
        Object.keys(backendErrors).forEach((key) => {
          newErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        });

        setErrors(newErrors);
      } else {
        setErrors({ general: "Connection error. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {name === "Login" ? (
        <form onSubmit={handleSubmit} className="form-container">
          <h1>{name}</h1>
          {errors.general && (
            <div className="error-general">{errors.general}</div>
          )}
          <input
            className={`form-input ${errors.username ? "error-input" : ""}`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
          <input
            className={`form-input ${errors.password ? "error-input" : ""}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
          {loading && <Loading />}
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : name}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <h1>{name}</h1>
          {errors.general && (
            <div className="error-general">{errors.general}</div>
          )}
          <input
            className={`form-input ${errors.username ? "error-input" : ""}`}
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
          <input
            className={`form-input ${errors.email ? "error-input" : ""}`}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
          <input
            className={`form-input ${errors.password ? "error-input" : ""}`}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
          <input
            className={`form-input ${
              errors.confirmPassword ? "error-input" : ""
            }`}
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
          {loading && <Loading />}
          <button className="form-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : name}
          </button>
        </form>
      )}
    </>
  );
};

export default Form;
