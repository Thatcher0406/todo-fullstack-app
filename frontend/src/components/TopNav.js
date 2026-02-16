import React from "react";

const TopNav = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "#F5F1E8",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      <input
        type="text"
        placeholder="Search tasks..."
        style={{
          padding: "8px 12px",
          borderRadius: "12px",
          border: "1px solid #D8D2C6",
          width: "300px"
        }}
      />
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
          JW
        </div>
      </div>
    </div>
  );
};

export default TopNav;
