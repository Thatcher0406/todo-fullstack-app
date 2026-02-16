import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthCard from "../components/AuthCard";
import { useToast } from "../context/ToastContext";

const passwordGuidelines = [
  { key: "length", label: "At least 8 characters", test: (value) => value.length >= 8 },
  { key: "letter", label: "At least one letter", test: (value) => /[A-Za-z]/.test(value) },
  { key: "number", label: "At least one number", test: (value) => /\d/.test(value) },
];

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    agree_terms: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(
    () => passwordGuidelines.map((rule) => ({ ...rule, ok: rule.test(formData.password) })),
    [formData.password]
  );

  const passwordValid = passwordChecks.every((item) => item.ok);

  useEffect(() => {
    if (!successMessage) return undefined;

    const timer = window.setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [successMessage, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!passwordValid) {
      setError("Password does not meet the guidelines.");
      return;
    }

    if (!formData.agree_terms) {
      setError("Please agree to the terms.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await API.post("auth/signup/", {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
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
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <div style={{ fontSize: 12, color: "#6A5F5F", marginTop: -6 }}>
            {passwordChecks.map((check) => (
              <div key={check.key} style={{ color: check.ok ? "#5F6F52" : "#6A5F5F" }}>
                {check.ok ? "- " : "- "}
                {check.label}
              </div>
            ))}
          </div>
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <label style={{ fontSize: "14px" }}>
            <input type="checkbox" name="agree_terms" checked={formData.agree_terms} onChange={handleChange} /> I agree to the Terms and Conditions
          </label>

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
