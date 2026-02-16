import React from "react";

const TaskCard = ({ title, description, priority, dueDate, actions }) => {
  const priorityColors = {
    Low: "#BFC8AD",
    Medium: "#5F6F52",
    High: "#6E2C2C",
  };

  const accentColor = priority ? priorityColors[priority] || "#D8D2C6" : "#D8D2C6";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "16px",
        marginBottom: "12px",
        transition: "box-shadow 0.2s",
        cursor: "pointer",
        borderLeft: `6px solid ${accentColor}`,
      }}
      onMouseOver={(event) => (event.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.13)")}
      onMouseOut={(event) => (event.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", fontSize: "16px", color: "#3B2F2F" }}>{title}</div>
        {priority && (
          <span
            style={{
              background: accentColor,
              color: priority === "High" ? "#fff" : "#3B2F2F",
              borderRadius: "6px",
              fontSize: "12px",
              padding: "2px 10px",
              marginLeft: "8px",
            }}
          >
            {priority}
          </span>
        )}
      </div>
      <div style={{ color: "#6E2C2C", fontSize: "13px", margin: "8px 0" }}>{description}</div>
      {dueDate && <div style={{ fontSize: "12px", color: "#5F6F52" }}>Due: {dueDate}</div>}
      {actions}
    </div>
  );
};

export default TaskCard;
