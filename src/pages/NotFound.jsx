import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.text}>
          The page you are looking for does not exist.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  card: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "16px",
    backgroundColor: "#1e293b",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
    color: "#f1f5f9",
    width: "400px",
  },
  code: {
    fontSize: "64px",
    marginBottom: "10px",
    color: "#6366f1",
  },
  title: {
    marginBottom: "10px",
  },
  text: {
    marginBottom: "25px",
    color: "#94a3b8",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default NotFound;
