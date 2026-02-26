import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task Manager</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.testAccount}>
        <p><strong>Reqres Test Account:</strong></p>
        <p>Email: eve.holt@reqres.in</p>
        <p>Password: cityslicka</p>
      </div>
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
    width: "360px",
    padding: "30px",
    borderRadius: "14px",
    backgroundColor: "#1e293b",
    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
    textAlign: "center",
    color: "#f1f5f9",
  },
  title: {
    marginBottom: "6px",
    fontSize: "22px",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6366f1",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },
  error: {
    color: "#f87171",
    marginTop: "10px",
    fontSize: "14px",
  },
  testAccount: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#94a3b8",
  },
};

export default Login;
