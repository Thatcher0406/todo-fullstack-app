import React from "react";

const StatsCard = ({ title, value, accentColor }) => {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      padding: "24px",
      minWidth: "180px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ fontSize: "18px", color: "#3B2F2F", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "32px", fontWeight: "bold", color: accentColor }}>{value}</div>
    </div>
  );
};

export default StatsCard;
