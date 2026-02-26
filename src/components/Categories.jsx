import React from "react";

const categoryList = [
  { name: "Work", color: "#3b82f6", icon: "💼" },
  { name: "Personal", color: "#ec4899", icon: "🏠" },
  { name: "Study", color: "#8b5cf6", icon: "📚" },
  { name: "Fitness", color: "#22c55e", icon: "💪" },
  { name: "Uncategorized", color: "#64748b", icon: "📌" },
];

function Categories({ selectedCategory, setSelectedCategory }) {
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          backgroundColor:
            selectedCategory === "all" ? "#475569" : "#334155",
        }}
        onClick={() => setSelectedCategory("all")}
      >
        All
      </button>

      {categoryList.map((cat) => (
        <button
          key={cat.name}
          style={{
            ...styles.button,
            backgroundColor:
              selectedCategory === cat.name
                ? cat.color
                : "#334155",
          }}
          onClick={() => setSelectedCategory(cat.name)}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}

export default Categories;
export const CATEGORY_STYLES = categoryList;

const styles = {
  container: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  button: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};
