import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthCard from "../components/AuthCard";
import { useToast } from "../context/ToastContext";

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!successMessage) return undefined;

    const timer = window.setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [successMessage, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      setError("");
      await API.post("signup/", {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMessage("Signup successful. Redirecting to login...");
      showToast("Signup successful. You can now sign in.", "info");
    } catch (err) {
      const message = err.response?.data?.detail || "Signup failed. Check your inputs.";
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
        <h2 style={{ color: "#6E2C2C", marginBottom: "24px", textAlign: "center" }}>Create Account</h2>

        {error && <p style={{ color: "#8C3B3B", textAlign: "center" }}>{error}</p>}
        {successMessage && <p style={{ color: "#5F6F52", textAlign: "center", fontWeight: "bold" }}>{successMessage}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

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
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p style={{ fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
          Already have an account? <Link to="/login" style={{ color: "#5F6F52" }}>Sign In</Link>
        </p>
      </AuthCard>
    </div>
  );
};

export default Signup;
