import React from "react";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginBottom: "15px" }}>Confirm Action</h3>
        <p style={{ marginBottom: "20px", color: "#94a3b8" }}>
          {message}
        </p>

        <div style={styles.buttonContainer}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            Confirm
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
    zIndex: 2000,
  },
  modal: {
    width: "400px",
    backgroundColor: "#1e293b",
    padding: "25px",
    borderRadius: "12px",
    color: "#f1f5f9",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#64748b",
    color: "#ffffff",
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    cursor: "pointer",
  },
};

export default ConfirmModal;
