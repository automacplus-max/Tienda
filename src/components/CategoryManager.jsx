// src/components/CategoryManager.jsx
import React, { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function CategoryManager() {
  const { categories, addCategory, removeCategory, addSubcategory, removeSubcategory } = useStore();
  const [newCategory, setNewCategory] = useState("");
  const [newSub, setNewSub] = useState({});
  const [expanded, setExpanded] = useState(null);

  function submitCategory() {
    addCategory(newCategory);
    setNewCategory("");
  }

  function submitSubcategory(catId) {
    const value = newSub[catId] || "";
    if (!value.trim()) return;
    addSubcategory(catId, value);
    setNewSub((prev) => ({ ...prev, [catId]: "" }));
  }

  return (
    <div className="admin__panel">
      <p className="admin__panel-title">Categorías</p>
      <div className="admin__category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="admin__category-row">
            <button className="admin__category-head" onClick={() => setExpanded((prev) => (prev === cat.id ? null : cat.id))}>
              <span>{cat.label}</span>
              <span className="admin__category-count">{cat.subcategories.length} subcategoría{cat.subcategories.length === 1 ? "" : "s"}</span>
              <span className={`admin__category-chev ${expanded === cat.id ? "is-open" : ""}`}>▾</span>
            </button>
            <button className="admin__category-remove" onClick={() => removeCategory(cat.id)}>
              ✕
            </button>

            {expanded === cat.id && (
              <div className="admin__subcategory-block">
                <div className="admin__subcategory-list">
                  {cat.subcategories.map((sub) => (
                    <span key={sub} className="admin__brand-chip">
                      {sub}
                      <button onClick={() => removeSubcategory(cat.id, sub)}>✕</button>
                    </span>
                  ))}
                  {cat.subcategories.length === 0 && <span className="admin__subcategory-empty">Sin subcategorías todavía.</span>}
                </div>
                <div className="admin__brand-input-row">
                  <input
                    placeholder="Nueva subcategoría"
                    value={newSub[cat.id] || ""}
                    onChange={(e) => setNewSub((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && submitSubcategory(cat.id)}
                  />
                  <button className="btn-fill" onClick={() => submitSubcategory(cat.id)}>
                    Agregar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="admin__brand-input-row">
        <input
          placeholder="Nueva categoría (ej: Accesorios)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitCategory()}
        />
        <button className="btn-fill" onClick={submitCategory}>
          Agregar
        </button>
      </div>
    </div>
  );
}
