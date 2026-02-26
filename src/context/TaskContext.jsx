import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [deletedTasks, setDeletedTasks] = useState(() => {
    const saved = localStorage.getItem("deletedTasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const normalizeCategory = (category) => {
    return category && category.trim() !== ""
      ? category
      : "Uncategorized";
  };

  const sortTasksByDueDate = (taskArray) => {
    return [...taskArray].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      const dateA = new Date(`${a.date}T${a.time || "23:59"}`);
      const dateB = new Date(`${b.date}T${b.time || "23:59"}`);

      return dateA - dateB;
    });
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      completed: false,
      completedAt: null,
      ...taskData,
      subtasks: taskData.subtasks
        ? taskData.subtasks.map((sub) =>
            typeof sub === "string"
              ? { text: sub, completed: false }
              : sub
          )
        : [],
      category: normalizeCategory(taskData.category),
    };

    setTasks((prev) =>
      sortTasksByDueDate([...prev, newTask])
    );
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) {
      setDeletedTasks((prev) => [taskToDelete, ...prev]);
    }
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const permanentlyDeleteTask = (id) => {
    setDeletedTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const restoreTask = (id) => {
    const taskToRestore = deletedTasks.find(
      (task) => task.id === id
    );
    if (taskToRestore) {
      setTasks((prev) =>
        sortTasksByDueDate([...prev, taskToRestore])
      );
    }
    setDeletedTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed
                ? Date.now()
                : null,
            }
          : task
      )
    );
  };

  const toggleSubtask = (taskId, subtaskIndex) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        const updatedSubtasks = task.subtasks.map((sub, index) =>
          index === subtaskIndex
            ? { ...sub, completed: !sub.completed }
            : sub
        );

        return { ...task, subtasks: updatedSubtasks };
      })
    );
  };

  const updateTask = (id, updatedData) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            ...updatedData,
            subtasks: updatedData.subtasks
              ? updatedData.subtasks.map((sub) =>
                  typeof sub === "string"
                    ? { text: sub, completed: false }
                    : sub
                )
              : [],
            category: normalizeCategory(updatedData.category),
          }
        : task
    );

    setTasks(sortTasksByDueDate(updatedTasks));
  };

  // AUTO DELETE AFTER 1 DAY
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => {
          if (!task.completed || !task.completedAt)
            return true;

          const oneDay = 24 * 60 * 60 * 1000;
          const expired =
            Date.now() - task.completedAt >= oneDay;

          return !expired;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        deletedTasks,
        addTask,
        deleteTask,
        permanentlyDeleteTask,
        restoreTask,
        toggleTask,
        toggleSubtask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}