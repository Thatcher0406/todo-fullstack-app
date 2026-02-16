import React, { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import { useToast } from "../context/ToastContext";

const emptyForm = { title: "", description: "", priority: "Medium", dueDate: "", status: "todo" };

const buttonStyle = {
  background: "#6E2C2C",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const columnStyle = {
  backgroundColor: "#E8E2D6",
  borderRadius: "12px",
  flex: 1,
  padding: "16px",
  minHeight: "400px",
  display: "flex",
  flexDirection: "column",
};

function getErrorMessage(error, fallback) {
  if (typeof error?.response?.data === "string") return error.response.data;
  if (typeof error?.response?.data?.detail === "string") return error.response.data.detail;
  if (error?.response?.data && typeof error.response.data === "object") {
    const firstValue = Object.values(error.response.data)[0];
    if (Array.isArray(firstValue) && firstValue.length > 0) return String(firstValue[0]);
  }
  return fallback;
}

const Dashboard = () => {
  const { showToast } = useToast();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("todos/");
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load tasks.");
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.status === "done" || todo.completed).length;
    const doing = todos.filter((todo) => todo.status === "doing").length;

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 6);

    const createdThisWeek = todos.filter((todo) => new Date(todo.created_at) >= weekStart).length;

    return { total, completed, doing, createdThisWeek };
  }, [todos]);

  const todoColumn = todos.filter((todo) => (todo.status || "todo") === "todo");
  const doingColumn = todos.filter((todo) => todo.status === "doing");
  const doneColumn = todos.filter((todo) => todo.status === "done" || todo.completed);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      const message = "Task title is required.";
      setError(message);
      showToast(message, "error");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await API.post("todos/", {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        due_date: form.dueDate || null,
        status: form.status,
      });

      setTodos((previous) => [response.data, ...previous]);
      setForm(emptyForm);
      setShowModal(false);
      showToast("Task added.", "info");
    } catch (err) {
      const message = getErrorMessage(err, "Could not create task.");
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (todoId, payload, successMessage) => {
    try {
      const response = await API.patch(`todos/${todoId}/`, payload);
      setTodos((previous) => previous.map((item) => (item.id === todoId ? response.data : item)));
      if (successMessage) showToast(successMessage, "info");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update task.");
      setError(message);
      showToast(message, "error");
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await API.delete(`todos/${todoId}/`);
      setTodos((previous) => previous.filter((item) => item.id !== todoId));
      showToast("Task deleted.", "info");
    } catch (err) {
      const message = getErrorMessage(err, "Could not delete task.");
      setError(message);
      showToast(message, "error");
    }
  };

  const renderTaskList = (items, emptyLabel, targetStatus) => {
    if (items.length === 0) {
      return <p style={{ margin: 0, color: "#6A5F5F", fontSize: "14px" }}>{emptyLabel}</p>;
    }

    return items.map((todo) => (
      <TaskCard
        key={todo.id}
        title={todo.title}
        description={todo.description || "No description"}
        priority={todo.priority}
        dueDate={todo.due_date || undefined}
        actions={
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {targetStatus !== "todo" && (
              <button
                type="button"
                onClick={() => updateTask(todo.id, { status: "todo" }, "Moved to To Do")}
                style={{ background: "#BFC8AD", color: "#3B2F2F", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                To Do
              </button>
            )}
            {targetStatus !== "doing" && (
              <button
                type="button"
                onClick={() => updateTask(todo.id, { status: "doing" }, "Moved to Doing")}
                style={{ background: "#5F6F52", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                Doing
              </button>
            )}
            {targetStatus !== "done" && (
              <button
                type="button"
                onClick={() => updateTask(todo.id, { status: "done" }, "Marked as Done")}
                style={{ background: "#6E2C2C", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                Done
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDelete(todo.id)}
              style={{ background: "#3B2F2F", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
              Delete
            </button>
          </div>
        }
      />
    ));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="Dashboard" />
      <div style={{ flex: 1, backgroundColor: "#F5F1E8", minHeight: "100vh" }}>
        <TopNav />

        {error && <div style={{ color: "#8C3B3B", padding: "12px 24px 0", fontWeight: "bold" }}>{error}</div>}

        <div style={{ display: "flex", gap: "16px", padding: "24px", flexWrap: "wrap" }}>
          <StatsCard title="Total Tasks" value={stats.total} accentColor="#5F6F52" />
          <StatsCard title="Doing" value={stats.doing} accentColor="#6E2C2C" />
          <StatsCard title="Completed" value={stats.completed} accentColor="#5F6F52" />
          <StatsCard title="Created (7d)" value={stats.createdThisWeek} accentColor="#6E2C2C" />
        </div>

        <div style={{ display: "flex", gap: "16px", padding: "24px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={columnStyle}>
              <h3 style={{ color: "#6E2C2C", marginBottom: "12px", marginTop: 0 }}>To Do</h3>
              {loading ? <p style={{ margin: 0, color: "#6A5F5F" }}>Loading tasks...</p> : renderTaskList(todoColumn, "No tasks in To Do.", "todo")}
            </div>

            <div style={columnStyle}>
              <h3 style={{ color: "#6E2C2C", marginBottom: "12px", marginTop: 0 }}>Doing</h3>
              {loading ? <p style={{ margin: 0, color: "#6A5F5F" }}>Loading tasks...</p> : renderTaskList(doingColumn, "No tasks in progress.", "doing")}
            </div>

            <div style={columnStyle}>
              <h3 style={{ color: "#6E2C2C", marginBottom: "12px", marginTop: 0 }}>Done</h3>
              {loading ? <p style={{ margin: 0, color: "#6A5F5F" }}>Loading tasks...</p> : renderTaskList(doneColumn, "No completed tasks yet.", "done")}
            </div>
          </div>

          <div style={{ alignSelf: "flex-start" }}>
            <button style={buttonStyle} onClick={() => setShowModal(true)}>
              + New Task
            </button>

            {showModal && (
              <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 32, borderRadius: 12, minWidth: 360, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 16 }}>
                  <h2 style={{ marginBottom: 12, marginTop: 0 }}>Add New Task</h2>
                  <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
                  <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
                  <select name="status" value={form.status} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                  <select name="priority" value={form.priority} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />

                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button type="submit" disabled={submitting} style={{ background: "#6E2C2C", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: "bold", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                      {submitting ? "Adding..." : "Add Task"}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} style={{ background: "#ccc", color: "#222", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
