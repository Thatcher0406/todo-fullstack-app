import React, { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import TaskCard from "../components/TaskCard";
import { useToast } from "../context/ToastContext";

function getErrorMessage(error) {
  if (typeof error?.response?.data?.detail === "string") return error.response.data.detail;
  if (typeof error?.response?.data === "string") return error.response.data;
  return "Failed to load tasks.";
}

const MyTasks = () => {
  const { showToast } = useToast();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("todos/");
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const activeTodos = useMemo(() => todos.filter((todo) => todo.status !== "done"), [todos]);

  const updateStatus = async (todo, status) => {
    try {
      const response = await API.patch(`todos/${todo.id}/`, { status });
      setTodos((previous) => previous.map((item) => (item.id === todo.id ? response.data : item)));
      showToast(`Task moved to ${status}.`, "info");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="My Tasks" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />
        <div style={{ padding: 32 }}>
          <h2 style={{ marginTop: 0 }}>My Tasks</h2>
          {error && <p style={{ color: "#8C3B3B", fontWeight: "bold" }}>{error}</p>}
          {loading && <p>Loading tasks...</p>}
          {!loading && activeTodos.length === 0 && <p>No active tasks found.</p>}

          {!loading &&
            activeTodos.map((todo) => (
              <TaskCard
                key={todo.id}
                title={todo.title}
                description={todo.description || "No description"}
                priority={todo.priority}
                dueDate={todo.due_date || undefined}
                actions={
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {todo.status !== "todo" && (
                      <button type="button" onClick={() => updateStatus(todo, "todo")} style={{ background: "#BFC8AD", color: "#3B2F2F", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}>To Do</button>
                    )}
                    {todo.status !== "doing" && (
                      <button type="button" onClick={() => updateStatus(todo, "doing")} style={{ background: "#5F6F52", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}>Doing</button>
                    )}
                    <button type="button" onClick={() => updateStatus(todo, "done")} style={{ background: "#6E2C2C", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}>Done</button>
                  </div>
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
