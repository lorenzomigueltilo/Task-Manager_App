import { useState, useEffect } from "react";
import { CATEGORY_STYLES } from "./Categories";

function AddTaskModal({ closeModal, addTask, existingTask, updateTask }) {
  const [taskName, setTaskName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const [category, setCategory] = useState("");
  const [originalSubtasks, setOriginalSubtasks] = useState([]);

  useEffect(() => {
    if (existingTask) {
      setTaskName(existingTask.title || "");
      setDate(existingTask.date || "");
      setTime(existingTask.time || "");
      setDescription(existingTask.description || "");
      setCategory(existingTask.category || "");

      if (existingTask.subtasks && existingTask.subtasks.length > 0) {
        if (typeof existingTask.subtasks[0] === "string") {
          setSubtasks(existingTask.subtasks);
          setOriginalSubtasks(
            existingTask.subtasks.map((text) => ({
              text,
              completed: false,
            }))
          );
        } else {
          setSubtasks(existingTask.subtasks.map((sub) => sub.text));
          setOriginalSubtasks(existingTask.subtasks);
        }
      } else {
        setSubtasks([""]);
        setOriginalSubtasks([]);
      }
    }
  }, [existingTask]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    const updated = subtasks.filter((_, i) => i !== index);
    setSubtasks(updated.length ? updated : [""]);
  };

  // Remove Time Handler
  const handleRemoveTime = () => {
    setTime("");
  };

  const handleSave = () => {
    if (!taskName.trim()) return;

    const filteredSubtasks = subtasks
      .filter((sub) => sub.trim() !== "")
      .map((subText, index) => {
        const original = originalSubtasks[index];

        return {
          text: subText,
          completed: original ? original.completed : false,
        };
      });

    const taskData = {
      title: taskName,
      date,
      time, // if empty string, it is properly removed
      description,
      subtasks: filteredSubtasks,
      category,
    };

    if (existingTask) {
      updateTask(existingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    closeModal();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {existingTask ? "Edit Task" : "Create New Task"}
        </h2>

        <label style={styles.label}>Name of Task</label>
        <input
          style={styles.input}
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <label style={styles.label}>Category</label>
        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {CATEGORY_STYLES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Date</label>
        <input
          type="date"
          style={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label style={styles.label}>Time</label>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="time"
            style={styles.input}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          {/* Show remove button only pag nag eexist*/}
          {time && (
            <button type="button"
              style={styles.removeTimeBtn}
              onClick={handleRemoveTime}
            >
              ✕
            </button>
          )}
        </div>

        <label style={styles.label}>Subtasks</label>
        {subtasks.map((sub, index) => (
          <div key={index} style={styles.subtaskRow}>
            <input
              style={styles.input}
              placeholder={`Subtask ${index + 1}`}
              value={sub}
              onChange={(e) =>
                handleSubtaskChange(index, e.target.value)
              }
            />
            <button
              type="button"
              style={styles.removeBtn}
              onClick={() => handleRemoveSubtask(index)}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          style={styles.addSubtaskBtn}
          onClick={handleAddSubtask}
        >
          + Add Subtask
        </button>

        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div style={styles.buttonContainer}>
          <button style={styles.cancelBtn} onClick={closeModal}>
            Cancel
          </button>
          <button style={styles.saveBtn} onClick={handleSave}>
            {existingTask ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    color: "#f1f5f9",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: { marginBottom: "10px" },
  label: { fontSize: "14px", color: "#94a3b8" },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
  },
  textarea: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    minHeight: "80px",
  },
  subtaskRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  removeBtn: {
    backgroundColor: "#ef4444",
    border: "none",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  removeTimeBtn: {
    backgroundColor: "#ef4444",
    border: "none",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  addSubtaskBtn: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#334155",
    color: "#f1f5f9",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "5px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  cancelBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    cursor: "pointer",
  },
};

export default AddTaskModal;