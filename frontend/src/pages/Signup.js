import React, { useState } from "react";
import API from "../services/api";
import AuthCard from "../components/AuthCard";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // POST to the correct backend route
      const response = await API.post("auth/signup/", {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Sign Up Success:", response.data);
      navigate("/login"); // redirect to login after signup
    } catch (err) {
      setError(err.response?.data || "Signup failed. Check your inputs.");
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
        <h2
          style={{
            color: "#6E2C2C",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Create Account
        </h2>

        {error && (
          <p style={{ color: "#8C3B3B", textAlign: "center" }}>{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <label style={{ fontSize: "14px" }}>
            <input
              type="checkbox"
              name="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
            />{" "}
            I agree to the Terms and Conditions
          </label>

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
            Create Account
          </button>
        </form>

        <p style={{ fontSize: "14px", marginTop: "12px", textAlign: "center" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#5F6F52" }}>
            Sign In
          </a>
        </p>
      </AuthCard>
    </div>
  );
};

export default Signup;
