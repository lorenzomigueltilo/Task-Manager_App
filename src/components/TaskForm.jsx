import { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import AddTaskModal from "./AddTaskModal";

function TaskForm() {
  const [showModal, setShowModal] = useState(false);
  const { addTask } = useContext(TaskContext);

  return (
    <>
      <div style={styles.wrapper}>
        <button
          type="button"
          style={styles.ghostButton}
          onClick={() => setShowModal(true)}
        >
          <span style={styles.icon}>＋</span>
          <span>Add Task</span>
        </button>
      </div>

      {showModal && (
        <AddTaskModal
          closeModal={() => setShowModal(false)}
          addTask={addTask}
        />
      )}
    </>
  );
}

const styles = {
  wrapper: {
    padding: "18px 30px",
    backgroundColor: "#0f172a",
    borderBottom: "1px solid #1e293b",
  },

  ghostButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "6px 4px",
    transition: "all 0.2s ease",
  },

  icon: {
    fontSize: "18px",
    fontWeight: "600",
    lineHeight: "1",
  },
};

export default TaskForm;
