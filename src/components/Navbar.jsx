import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <h3 style={styles.title}>Task Manager</h3>
      <button style={styles.button} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 30px",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  title: {
    margin: 0,
  },
  button: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;
