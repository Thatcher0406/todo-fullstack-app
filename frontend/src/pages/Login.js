import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("auth/login/", {
        username: formData.username.trim(),
        password: formData.password,
      });

      await login({
        access: response.data.access,
        refresh: response.data.refresh,
      });

      showToast("Welcome back.", "info");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.detail || "Login failed. Check username/password.";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
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
        <h2 style={{ color: "#6E2C2C", marginBottom: "24px", textAlign: "center" }}>Sign In</h2>

        {error && <p style={{ color: "#8C3B3B", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#6E2C2C",
              color: "#F5F1E8",
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
          Don&apos;t have an account? <Link to="/signup" style={{ color: "#5F6F52" }}>Create Account</Link>
        </p>
      </AuthCard>
    </div>
  );
};

export default Login;
