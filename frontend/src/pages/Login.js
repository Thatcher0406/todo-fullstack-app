import React, { useState } from "react";
import API from "../services/api"; // Axios instance with baseURL
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      // Save JWT in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Optional: attach token to Axios default headers
      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;

      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Check username/password."
      );
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F1E8",
      }}
    >
      <AuthCard>
        <h2 style={{ color: "#6E2C2C", marginBottom: "24px", textAlign: "center" }}>
          Sign In
        </h2>

        {error && <p style={{ color: "#8C3B3B", textAlign: "center" }}>{error}</p>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            name="username"
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#6E2C2C",
              color: "#F5F1E8",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <a href="/signup" style={{ color: "#5F6F52" }}>
            Create Account
          </a>
        </p>
      </AuthCard>
    </div>
  );
};

export default Login;
