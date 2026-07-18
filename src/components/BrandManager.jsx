// src/components/BrandManager.jsx
import React, { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function BrandManager() {
  const { brands, addBrand, removeBrand } = useStore();
  const [newBrand, setNewBrand] = useState("");

  function submit() {
    addBrand(newBrand);
    setNewBrand("");
  }

  return (
    <div className="admin__panel">
      <p className="admin__panel-title">Marcas</p>
      <div className="admin__brand-list">
        {brands.map((b) => (
          <span key={b} className="admin__brand-chip">
            {b}
            <button onClick={() => removeBrand(b)}>✕</button>
          </span>
        ))}
        {brands.length === 0 && <span className="admin__subcategory-empty">Todavía no hay marcas cargadas.</span>}
      </div>
      <div className="admin__brand-input-row">
        <input
          placeholder="Nueva marca (ej: Marca 4)"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn-fill" onClick={submit}>
          Agregar
        </button>
      </div>
    </div>
  );
}
