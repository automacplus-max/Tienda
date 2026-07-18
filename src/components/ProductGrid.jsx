// src/components/ProductGrid.jsx
import React, { useState } from "react";
import PieceIcon from "./icons/PieceIcon.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function ProductGrid({ products, onEdit }) {
  const { deleteProduct, duplicateProduct, toggleProductVisible } = useStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (products.length === 0) {
    return <p className="admin__empty">No hay productos cargados.</p>;
  }

  return (
    <div className="admin__product-grid">
      {products.map((p) => {
        const hidden = p.visible === false;
        return (
          <div key={p.id} className={`admin__product-card ${hidden ? "is-hidden" : ""}`}>
            <div className="admin__product-card-thumb">
              {p.images?.length ? <img src={p.images[0]} alt="" /> : <PieceIcon type={p.icon} className="admin__product-icon" />}
              {hidden && <span className="admin__product-card-badge">Oculto</span>}
            </div>
            <div className="admin__product-card-body">
              <p className="admin__product-name">{p.name}</p>
              <p className="admin__product-meta">
                {p.category}
                {p.subcategory ? ` / ${p.subcategory}` : ""} · {p.brand}
              </p>
              <p className="admin__product-card-price">
                US$ {p.price.toLocaleString()}
                {p.originalPrice ? <span className="admin__product-card-price-original"> US$ {p.originalPrice.toLocaleString()}</span> : ""}
              </p>
            </div>

            <div className="admin__product-card-actions">
              <button className="admin__edit-btn" onClick={() => onEdit(p)}>
                Editar
              </button>
              <button className="admin__edit-btn" onClick={() => duplicateProduct(p.id)}>
                Duplicar
              </button>
              <button className="admin__edit-btn" onClick={() => toggleProductVisible(p.id)}>
                {hidden ? "Mostrar" : "Ocultar"}
              </button>
              {confirmDeleteId === p.id ? (
                <span className="admin__confirm-delete">
                  <span>¿Seguro?</span>
                  <button
                    onClick={() => {
                      deleteProduct(p.id);
                      setConfirmDeleteId(null);
                    }}
                  >
                    Sí
                  </button>
                  <button onClick={() => setConfirmDeleteId(null)}>No</button>
                </span>
              ) : (
                <button className="admin__delete-btn" onClick={() => setConfirmDeleteId(p.id)}>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
