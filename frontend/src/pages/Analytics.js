import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

const COLORS = ["#5F6F52", "#6E2C2C", "#D8D2C6"];

const cardStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: "24px",
};

function getDateKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getErrorMessage(error) {
  if (typeof error?.response?.data?.detail === "string") return error.response.data.detail;
  if (typeof error?.response?.data === "string") return error.response.data;
  return "Failed to load analytics data.";
}

export default function Analytics() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get("todos/");
        setTodos(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const computed = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((todo) => todo.status === "done" || todo.completed).length;
    const toDo = total - done;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    const dayBuckets = [];
    const dayMap = {};

    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - index);

      const key = getDateKey(day);
      const name = day.toLocaleDateString("en-US", { weekday: "short" });
      const bucket = { name, completed: 0, key };

      dayBuckets.push(bucket);
      dayMap[key] = bucket;
    }

    todos.forEach((todo) => {
      if (!(todo.status === "done" || todo.completed)) return;
      const key = getDateKey(todo.created_at);
      if (dayMap[key]) {
        dayMap[key].completed += 1;
      }
    });

    const barData = dayBuckets.map(({ key, ...rest }) => rest);

    const pieData =
      total > 0
        ? [
            { name: "Done", value: done },
            { name: "To Do", value: toDo },
          ]
        : [{ name: "No Tasks", value: 1 }];

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 6);

    const createdThisWeek = todos.filter((todo) => new Date(todo.created_at) >= weekStart).length;

    return {
      barData,
      pieData,
      total,
      done,
      completionRate,
      createdThisWeek,
    };
  }, [todos]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="Analytics" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />

        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", color: "#3B2F2F" }}>Productivity Analytics</h1>
            <p style={{ marginTop: "8px", color: "#6A5F5F" }}>Insights based on your live tasks data.</p>
          </div>

          {error && <p style={{ margin: 0, color: "#8C3B3B", fontWeight: "bold" }}>{error}</p>}
          {loading && <p style={{ margin: 0 }}>Loading analytics...</p>}

          {!loading && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                  gap: "20px",
                }}
              >
                <div style={cardStyle}>
                  <h3 style={{ marginTop: 0, marginBottom: "24px", color: "#3B2F2F" }}>Tasks Completed (Last 7 Days)</h3>
                  <div style={{ height: "350px", width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={computed.barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D8D2C6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6A5F5F", fontSize: 12 }} dy={10} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#6A5F5F", fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#E8E2D6",
                            borderRadius: "12px",
                            border: "1px solid #D8D2C6",
                          }}
                          cursor={{ fill: "rgba(95, 111, 82, 0.1)" }}
                        />
                        <Bar dataKey="completed" fill="#6E2C2C" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={cardStyle}>
                  <h3 style={{ marginTop: 0, marginBottom: "24px", color: "#3B2F2F" }}>Task Status Distribution</h3>
                  <div style={{ height: "350px", width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={computed.pieData}
                          cx="50%"
                          cy="45%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {computed.pieData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#E8E2D6",
                            borderRadius: "12px",
                            border: "1px solid #D8D2C6",
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >
                <StatHighlight label="Total Tasks" value={String(computed.total)} change="Live" positive />
                <StatHighlight label="Completion Rate" value={`${computed.completionRate}%`} change="Live" positive />
                <StatHighlight label="Created (7d)" value={String(computed.createdThisWeek)} change="Live" positive />
                <StatHighlight label="Completed" value={String(computed.done)} change="Live" positive />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatHighlight({ label, value, change, positive }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: "14px", color: "#6A5F5F", marginBottom: "8px", marginTop: 0 }}>{label}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <h4 style={{ fontSize: "28px", margin: 0, color: "#3B2F2F" }}>{value}</h4>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            padding: "4px 8px",
            borderRadius: "999px",
            backgroundColor: positive ? "rgba(95, 111, 82, 0.12)" : "rgba(110, 44, 44, 0.12)",
            color: positive ? "#5F6F52" : "#6E2C2C",
          }}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
