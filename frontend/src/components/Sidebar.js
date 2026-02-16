import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active }) => {
  const navigate = useNavigate();
  const items = ["Dashboard", "My Tasks", "Completed", "Analytics", "Settings", "Logout"];

  const handleClick = (item) => {
    if (item === "Logout") {
      localStorage.removeItem("token"); // clear JWT
      navigate("/login");
    } else {
      navigate(`/${item.replace(" ", "").toLowerCase()}`);
    }
  };

  return (
    <div style={{
      width: "200px",
      backgroundColor: "#E8E2D6",
      minHeight: "100vh",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      {items.map((item) => (
        <div
          key={item}
          onClick={() => handleClick(item)}
          style={{
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: active === item ? "#6E2C2C" : "transparent",
            color: active === item ? "#F5F1E8" : "#3B2F2F",
            cursor: "pointer",
            fontWeight: active === item ? "bold" : "normal"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
