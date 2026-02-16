import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

const TopNav = () => {
  const { user } = useAuth();

  const initial = useMemo(() => {
    const username = user?.username || "";
    return (username.trim()[0] || "U").toUpperCase();
  }, [user]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "#F5F1E8",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "#5F6F52",
          color: "#F5F1E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          {initial}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
