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
    if (!username) newErrors.username = "Username is required.";
    if (method !== "login") {
      if (!email) {
        newErrors.email = "Email is required.";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          newErrors.email = "Invalid email format.";
        }
      }
    }
    if (!password) newErrors.password = "Password is required.";
    if (method === "register") {
      // if (password.length < 6) {
      //   newErrors.password = "Password must be at least 6 characters.";
      // }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) {
      return;
    }
    setLoading(true);

    try {
      const endpoint = route.endsWith("/") ? route : `${route}/`;
      const payload =
        method === "register"
          ? { username, password, email }
          : { username, password };
      const res = await api.post(endpoint, payload);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const newErrors = {};
        if (backendErrors.username) {
          newErrors.username = backendErrors.username[0];
        }
        // jeszcze niby maile ale chuj bo one nie są w django user domyślnie unikalne
        // a nie chcę robić custom usera
        setErrors(newErrors);
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
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
          {loading && <Loading />}
          <button className="form-button" type="submit" disabled={loading}>
            {name}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
          <h1>{name}</h1>
          <input
            className="form-input"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {errors.username && <span className="error">{errors.username}</span>}
          <input
            className="form-input"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
          <input
            className="form-input"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
          <input
            className="form-input"
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
            {name}
          </button>
        </form>
      )}
    </>
  );
};

export default Form;
