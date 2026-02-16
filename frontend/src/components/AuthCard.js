import React from "react";

const AuthCard = ({ children }) => {
  return (
    <div style={{
      backgroundColor: "#E8E2D6",  // Soft Sand
      padding: "32px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "400px",
      margin: "auto",
    }}>
      {children}
    </div>
  );
};

export default AuthCard;
