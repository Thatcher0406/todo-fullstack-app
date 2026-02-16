import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#F5F1E8" }}>
      
      {/* Top Navigation */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 64px",
      }}>
        <div style={{ fontWeight: "bold", fontSize: "24px", color: "#6E2C2C" }}>
          To-Do App
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a href="#features" style={{ textDecoration: "none", color: "#3B2F2F" }}>Features</a>
          <a href="#about" style={{ textDecoration: "none", color: "#3B2F2F" }}>About</a>
          <button
            onClick={() => navigate("/login")}
            style={{
              border: "1px solid #6E2C2C",
              borderRadius: "12px",
              padding: "8px 16px",
              background: "transparent",
              color: "#6E2C2C",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              borderRadius: "12px",
              padding: "8px 16px",
              backgroundColor: "#6E2C2C",
              color: "#F5F1E8",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "80px 24px",
        backgroundColor: "#F5F1E8",
      }}>
        <h1 style={{ fontSize: "40px", color: "#6E2C2C", marginBottom: "16px" }}>
          Stay Organized. Build With Focus.
        </h1>
        <p style={{ fontSize: "16px", color: "#3B2F2F", marginBottom: "24px" }}>
          A structured productivity tool designed for engineers who value clarity and execution.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              borderRadius: "12px",
              padding: "12px 24px",
              backgroundColor: "#6E2C2C",
              color: "#F5F1E8",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              borderRadius: "12px",
              padding: "12px 24px",
              backgroundColor: "#5F6F52",
              color: "#F5F1E8",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", padding: "64px" }}>
        {[
          { title: "Structured Workflow", desc: "Organize your tasks efficiently." },
          { title: "Priority Tagging", desc: "Highlight what matters most." },
          { title: "Deadline Tracking", desc: "Never miss a deadline." },
          { title: "Focus Mode", desc: "Eliminate distractions and concentrate." },
        ].map((feature) => (
          <div key={feature.title} style={{
            backgroundColor: "#E8E2D6",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: "20px", color: "#6E2C2C", marginBottom: "8px" }}>{feature.title}</h3>
            <p style={{ fontSize: "14px", color: "#6A5F5F" }}>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: "center", padding: "64px" }}>
        <h2 style={{ fontSize: "28px", color: "#6E2C2C", marginBottom: "16px" }}>
          Ready to take control of your tasks?
        </h2>
        <button
          onClick={() => navigate("/signup")}
          style={{
            borderRadius: "12px",
            padding: "12px 24px",
            backgroundColor: "#6E2C2C",
            color: "#F5F1E8",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "24px", fontSize: "14px", color: "#6A5F5F" }}>
        © 2026 To-Do App | <a href="#" style={{ color: "#6E2C2C" }}>Terms</a> | <a href="#" style={{ color: "#6E2C2C" }}>Privacy</a>
      </footer>

    </div>
  );
};

export default Home;
