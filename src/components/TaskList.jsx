import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import AddTaskModal from "./AddTaskModal";
import ConfirmModal from "./ConfirmModal";
import { CATEGORY_STYLES } from "./Categories";

function TaskList() {
  const {
    tasks,
    deletedTasks,
    deleteTask,
    permanentlyDeleteTask,
    restoreTask,
    toggleTask,
    toggleSubtask,
    updateTask,
  } = useContext(TaskContext);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmPermanentDeleteId, setConfirmPermanentDeleteId] = useState(null);
  const [confirmToggleTask, setConfirmToggleTask] = useState(null);
  const [confirmRestoreTask, setConfirmRestoreTask] = useState(null);

  const [, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isOverdue = (task) => {
    if (task.completed) return false;
    if (!task.date) return false;

    const dueDate = new Date(
      `${task.date}T${task.time || "23:59"}`
    );

    return new Date() > dueDate;
  };

  const baseTasks =
    filter === "recentlyDeleted" ? deletedTasks : tasks;

  const filteredTasks = baseTasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "overdue") return isOverdue(task);
      return true;
    })
    .filter((task) => {
      if (selectedCategory === "all") return true;
      return task.category === selectedCategory;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEmptyStateMessage = () => {
    if (filter === "completed") {
      return "No completed tasks yet 🎯 Complete a task and it will appear here.";
    }
    if (filter === "pending") {
      return "You're all caught up! 🚀 No pending tasks.";
    }
    if (filter === "overdue") {
      return "No overdue tasks 🎉 Great job staying on track!";
    }
    if (filter === "recentlyDeleted") {
      return "Nothing in trash 🗑️ Deleted tasks will appear here.";
    }
    return "Nothing here yet 👀 Add a task to get started.";
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Task List</h3>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* UPDATED MODERN TAB DESIGN */}
      <div style={styles.tabWrapper}>
        <div style={styles.tabContainer}>
          {["all", "completed", "pending", "overdue", "recentlyDeleted"].map(
            (tab) => (
              <button
                key={tab}
                style={{
                  ...styles.tabBtn,
                  ...(filter === tab && styles.activeTab),
                }}
                onClick={() => setFilter(tab)}
              >
                {tab === "recentlyDeleted"
                  ? "Recently Deleted"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div style={styles.secondaryFilter}>
        <label style={styles.dropdownLabel}>
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          style={styles.dropdown}
        >
          <option value="all">All</option>
          {CATEGORY_STYLES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 && (
        <div style={styles.emptyState}>
          {getEmptyStateMessage()}
        </div>
      )}

      {filteredTasks.map((task) => {
        const categoryStyle = CATEGORY_STYLES.find(
          (c) => c.name === task.category
        );

        const overdue = isOverdue(task);
        const completed = task.completed;

        return (
          <div
            key={task.id}
            style={{
              ...styles.taskItem,
              ...(overdue && styles.overdueTask),
              ...(completed && styles.completedTask),
            }}
          >
            {filter !== "recentlyDeleted" && (
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => setConfirmToggleTask(task)}
              />
            )}

            <div style={{ flex: 1 }}>
              <h4 style={styles.taskTitle}>
                {task.title}

                <span
                  style={{
                    ...styles.categoryLabel,
                    backgroundColor:
                      categoryStyle?.color || "#64748b",
                  }}
                >
                  {categoryStyle?.icon || "📌"} {task.category}
                </span>

                {task.completed && (
                  <span style={styles.completedBadge}>
                    ✔ Completed
                  </span>
                )}

                {overdue && (
                  <span style={styles.overdueBadge}>
                    ⚠ Overdue
                  </span>
                )}
              </h4>

              {task.date && (
                <p style={styles.metaText}>
                  📅 {formatDate(task.date)}
                </p>
              )}

              {task.time && (
                <p style={styles.metaText}>
                  ⏰ {formatTime(task.time)}
                </p>
              )}

              {task.completed && task.completedAt && (
                <>
                  <p style={styles.metaText}>
                    Date Completion:{" "}
                    {new Date(task.completedAt).toLocaleDateString("en-US")}
                  </p>

                  <p style={styles.metaText}>
                    Time Completion:{" "}
                    {new Date(task.completedAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  <p style={{ ...styles.metaText, color: "#f59e0b" }}>
                    ⏳ This task will be automatically deleted after 1 day.
                  </p>
                </>
              )}

              {task.subtasks &&
                task.subtasks.length > 0 && (
                  <>
                    <p style={styles.sectionLabel}>
                      Subtasks
                    </p>
                    <ul style={styles.subtaskList}>
                      {task.subtasks.map((sub, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {filter !== "recentlyDeleted" && (
                            <input
                              type="checkbox"
                              checked={sub.completed}
                              onChange={() =>
                                toggleSubtask(task.id, index)
                              }
                            />
                          )}

                          <span
                            style={{
                              textDecoration: sub.completed
                                ? "line-through"
                                : "none",
                              opacity: sub.completed ? 0.6 : 1,
                            }}
                          >
                            {sub.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

              {task.description && (
                <>
                  <p style={styles.sectionLabel}>
                    Description
                  </p>
                  <p style={styles.description}>
                    {task.description}
                  </p>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {filter !== "recentlyDeleted" &&
                !task.completed && (
                  <>
                    <button
                      style={{
                        ...styles.smallBtn,
                        backgroundColor: "#22c55e",
                      }}
                      onClick={() => setEditTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        ...styles.smallBtn,
                        backgroundColor: "#ef4444",
                      }}
                      onClick={() =>
                        setConfirmDeleteId(task.id)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}

              {filter !== "recentlyDeleted" &&
                task.completed && (
                  <button
                    style={{
                      ...styles.smallBtn,
                      backgroundColor: "#f59e0b",
                    }}
                    onClick={() =>
                      setConfirmToggleTask(task)
                    }
                  >
                    Unmark
                  </button>
                )}

              {filter === "recentlyDeleted" && (
                <>
                  <button
                    style={{
                      ...styles.smallBtn,
                      backgroundColor: "#22c55e",
                    }}
                    onClick={() =>
                      setConfirmRestoreTask(task)
                    }
                  >
                    Restore
                  </button>

                  <button
                    style={{
                      ...styles.smallBtn,
                      backgroundColor: "#ef4444",
                    }}
                    onClick={() =>
                      setConfirmPermanentDeleteId(task.id)
                    }
                  >
                    Delete Permanently
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      {editTask && (
        <AddTaskModal
          closeModal={() => setEditTask(null)}
          existingTask={editTask}
          updateTask={updateTask}
        />
      )}

      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this task?"
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            deleteTask(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
        />
      )}

      {confirmPermanentDeleteId && (
        <ConfirmModal
          message="Are you sure you want to permanently delete this task?"
          onCancel={() =>
            setConfirmPermanentDeleteId(null)
          }
          onConfirm={() => {
            permanentlyDeleteTask(confirmPermanentDeleteId);
            setConfirmPermanentDeleteId(null);
          }}
        />
      )}
      {confirmToggleTask && (
        <ConfirmModal
          message={
            confirmToggleTask.completed
              ? "Are you sure you want to unmark this completed task?"
              : "Are you sure you want to mark this task as completed?"
          }
          onCancel={() => setConfirmToggleTask(null)}
          onConfirm={() => {
            toggleTask(confirmToggleTask.id);
            setConfirmToggleTask(null);
          }}
        />
      )}
      {confirmRestoreTask && (
        <ConfirmModal
          message="Are you sure you want to restore this task?"
          onCancel={() => setConfirmRestoreTask(null)}
          onConfirm={() => {
            restoreTask(confirmRestoreTask.id);
            setConfirmRestoreTask(null);
          }}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 30px",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    color: "#f1f5f9",
  },

  emptyState: {
    marginTop: "40px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    border: "1px dashed #334155",
    color: "#94a3b8",
  },

  title: { marginBottom: "15px" },

  search: {
    padding: "8px",
    width: "100%",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
  },

  /* 🔥 MODERN TAB UI */
  tabWrapper: {
    marginBottom: "20px",
  },

  tabContainer: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    backgroundColor: "#1e293b",
    borderRadius: "14px",
    border: "1px solid #334155",
    flexWrap: "wrap",
  },

  tabBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease-in-out",
  },

  activeTab: {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#ffffff",
    boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
  },

  secondaryFilter: {
    marginBottom: "30px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dropdownLabel: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  dropdown: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    width: "220px",
  },

  taskItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "15px",
    padding: "20px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
  },

  overdueTask: {
    border: "1px solid #ef4444",
  },

  completedTask: {
    border: "1px solid #22c55e",
  },

  taskTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  categoryLabel: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#fff",
  },

  completedBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    backgroundColor: "#22c55e",
    color: "#fff",
  },

  overdueBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    backgroundColor: "#ef4444",
    color: "#fff",
  },

  metaText: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "4px",
  },

  sectionLabel: {
    marginTop: "10px",
    fontWeight: "600",
    fontSize: "14px",
  },

  description: {
    fontSize: "14px",
    marginTop: "4px",
    color: "#cbd5e1",
  },

  subtaskList: {
    paddingLeft: "20px",
    marginTop: "4px",
    fontSize: "14px",
  },

  smallBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
  },
};

export default TaskList;