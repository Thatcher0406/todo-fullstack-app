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

const Completed = () => {
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

  const completedTodos = useMemo(() => todos.filter((todo) => todo.status === "done"), [todos]);

  const markActive = async (todo) => {
    try {
      const response = await API.patch(`todos/${todo.id}/`, { status: "todo" });
      setTodos((previous) => previous.map((item) => (item.id === todo.id ? response.data : item)));
      showToast("Moved back to To Do.", "info");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, "error");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="Completed" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />
        <div style={{ padding: 32 }}>
          <h2 style={{ marginTop: 0 }}>Completed Tasks</h2>
          {error && <p style={{ color: "#8C3B3B", fontWeight: "bold" }}>{error}</p>}
          {loading && <p>Loading tasks...</p>}
          {!loading && completedTodos.length === 0 && <p>No completed tasks yet.</p>}

          {!loading &&
            completedTodos.map((todo) => (
              <TaskCard
                key={todo.id}
                title={todo.title}
                description={todo.description || "No description"}
                priority={todo.priority}
                dueDate={todo.due_date || undefined}
                actions={
                  <div style={{ marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => markActive(todo)}
                      style={{
                        background: "#BFC8AD",
                        color: "#3B2F2F",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Move to To Do
                    </button>
                  </div>
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Completed;
