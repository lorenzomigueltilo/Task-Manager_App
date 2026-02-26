import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  return (
    <div style={styles.container}>
      <Navbar />
      <TaskForm />
      <TaskList />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
  },
};

export default Dashboard;
