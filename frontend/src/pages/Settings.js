import React, { useEffect, useMemo, useState } from "react";
import { Bell, Lock, Shield, Trash2, User } from "lucide-react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const cardStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: "24px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #D8D2C6",
  marginTop: "6px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  color: "#3B2F2F",
  marginBottom: "2px",
};

const primaryButton = {
  backgroundColor: "#6E2C2C",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const outlineButton = {
  backgroundColor: "#fff",
  color: "#6E2C2C",
  border: "1px solid #6E2C2C",
  borderRadius: "8px",
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

function getErrorMessage(error, fallback) {
  if (typeof error?.response?.data?.detail === "string") return error.response.data.detail;
  if (typeof error?.response?.data === "string") return error.response.data;
  if (error?.response?.data && typeof error.response.data === "object") {
    const firstValue = Object.values(error.response.data)[0];
    if (Array.isArray(firstValue) && firstValue.length > 0) return String(firstValue[0]);
  }
  return fallback;
}

export default function Settings() {
  const { user, setUser, fetchUser } = useAuth();
  const { showToast } = useToast();

  const [darkMode, setDarkMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark = savedTheme === "dark";
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
      return;
    }

    const load = async () => {
      setLoadingProfile(true);
      await fetchUser();
      setLoadingProfile(false);
    };

    load();
  }, [user, fetchUser]);

  const initials = useMemo(() => {
    return (profile.username?.trim()?.[0] || "U").toUpperCase();
  }, [profile.username]);

  const toggleDarkMode = () => {
    setDarkMode((previous) => {
      const next = !previous;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleProfileChange = (event) => {
    setProfile((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setError("");

      const payload = {
        username: profile.username.trim(),
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        email: profile.email.trim(),
      };

      const response = await API.patch("auth/me/", payload);
      setUser(response.data);
      showToast("Profile updated.", "info");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update profile.");
      setError(message);
      showToast(message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      const message = "Both password fields are required.";
      setError(message);
      showToast(message, "error");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");

      await API.post("auth/change-password/", {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });

      setPasswordForm({ currentPassword: "", newPassword: "" });
      showToast("Password updated successfully.", "info");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update password.");
      setError(message);
      showToast(message, "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="Settings" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />

        <div style={{ maxWidth: "980px", padding: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", color: "#3B2F2F" }}>Settings</h1>
            <p style={{ marginTop: "8px", color: "#6A5F5F" }}>Manage your account preferences and security.</p>
          </div>

          {error && <p style={{ margin: 0, color: "#8C3B3B", fontWeight: "bold" }}>{error}</p>}

          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "#3B2F2F" }}>
              <User size={18} color="#5F6F52" />
              Profile Information
            </h3>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #ECE6DA", paddingBottom: "16px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "999px",
                    backgroundColor: "#5F6F52",
                    color: "#F5F1E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <button type="button" style={outlineButton}>Avatar Upload (Soon)</button>
                  <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#6A5F5F" }}>
                    @{profile.username || "username"}
                  </p>
                </div>
              </div>

              {loadingProfile ? (
                <p style={{ margin: 0 }}>Loading profile...</p>
              ) : (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Username</label>
                      <input name="username" type="text" value={profile.username} onChange={handleProfileChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input name="email" type="email" value={profile.email} onChange={handleProfileChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input name="first_name" type="text" value={profile.first_name} onChange={handleProfileChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input name="last_name" type="text" value={profile.last_name} onChange={handleProfileChange} style={inputStyle} />
                    </div>
                  </div>

                  <button type="button" style={primaryButton} onClick={handleSaveProfile} disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "#3B2F2F" }}>
              <Lock size={18} color="#5F6F52" />
              Security
            </h3>
            <div style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
                  />
                </div>
              </div>
              <button type="button" style={outlineButton} onClick={handleUpdatePassword} disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "#3B2F2F" }}>
              <Shield size={18} color="#5F6F52" />
              Preferences
            </h3>
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #ECE6DA" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#3B2F2F" }}>Dark Mode</p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6A5F5F" }}>Adjust the theme to your preference.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  style={{
                    width: "48px",
                    height: "24px",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: darkMode ? "#5F6F52" : "#D8D2C6",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: darkMode ? "27px" : "3px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      backgroundColor: "#fff",
                      transition: "left 0.2s ease",
                    }}
                  />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#3B2F2F", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bell size={16} color="#5F6F52" />
                    Email Notifications
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6A5F5F" }}>
                    Receive daily summaries of your tasks.
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    width: "48px",
                    height: "24px",
                    borderRadius: "999px",
                    border: "none",
                    backgroundColor: "#5F6F52",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: "27px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "999px",
                      backgroundColor: "#fff",
                    }}
                  />
                </button>
              </div>
            </div>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", color: "#6E2C2C" }}>
              <Trash2 size={18} color="#6E2C2C" />
              Danger Zone
            </h3>
            <div style={{ ...cardStyle, border: "1px solid rgba(110, 44, 44, 0.25)", backgroundColor: "rgba(110, 44, 44, 0.05)" }}>
              <div style={{ display: "flex", gap: "14px", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#3B2F2F" }}>Delete Account</p>
                  <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#6A5F5F" }}>
                    Account deletion workflow is not connected yet.
                  </p>
                </div>
                <button type="button" style={{ ...primaryButton, backgroundColor: "#6E2C2C", opacity: 0.7, cursor: "not-allowed" }} disabled>
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
