// src/components/CategoryTabs.jsx
import React from "react";
import { CATEGORIES } from "../data/products.js";

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-tabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`category-tabs__item ${activeCategory === cat ? "is-active" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
