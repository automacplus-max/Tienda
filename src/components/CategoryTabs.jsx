// src/components/CategoryTabs.jsx
import React from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function CategoryTabs({ activeCategory, onSelectCategory }) {
  const { categories } = useStore();

  return (
    <div className="category-tabs">
      <button
        onClick={() => onSelectCategory("Todo")}
        className={`category-tabs__item ${activeCategory === "Todo" ? "is-active" : ""}`}
      >
        Todo
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`category-tabs__item ${activeCategory === cat.id ? "is-active" : ""}`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
