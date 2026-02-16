import React from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="Dashboard" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />

        {/* Stats Section */}
        <div style={{ display: "flex", gap: "16px", padding: "24px", flexWrap: "wrap" }}>
          <StatsCard title="Total Tasks" value={42} accentColor="#5F6F52" />
          <StatsCard title="In Progress" value={12} accentColor="#6E2C2C" />
          <StatsCard title="Completed" value={25} accentColor="#5F6F52" />
          <StatsCard title="Overdue" value={5} accentColor="#6E2C2C" />
        </div>

        {/* Task Management Area */}
        <div style={{ display: "flex", gap: "16px", padding: "24px" }}>
          {["To Do", "Doing", "Done"].map((column) => (
            <div key={column} style={{
              backgroundColor: "#E8E2D6",
              borderRadius: "12px",
              flex: 1,
              padding: "16px",
              minHeight: "400px"
            }}>
              <h3 style={{ color: "#6E2C2C", marginBottom: "12px" }}>{column}</h3>
              {/* Task Cards will go here */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
