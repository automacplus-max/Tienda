// src/pages/Admin.jsx
import React, { useState } from "react";
import PieceIcon from "../components/icons/PieceIcon.jsx";
import ProductForm from "../components/ProductForm.jsx";
import CategoryManager from "../components/CategoryManager.jsx";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/admin.css";

export default function Admin() {
  const { products, brands, categories, saveProduct, deleteProduct, addBrand, removeBrand, navigate, nextId, logoutAdmin } = useStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [newBrand, setNewBrand] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setFormOpen(true);
  }

  function handleSave(data) {
    const id = editing ? editing.id : nextId();
    saveProduct({ ...data, id });
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <h1>Panel de administradores</h1>
        <div className="admin__header-actions">
          <button className="admin__exit" onClick={() => navigate("catalog")}>
            ← Volver a la tienda
          </button>
          <button className="admin__exit" onClick={logoutAdmin}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <CategoryManager />

      {/* Marcas */}
      <div className="admin__panel">
        <p className="admin__panel-title">Marcas</p>
        <div className="admin__brand-list">
          {brands.map((b) => (
            <span key={b} className="admin__brand-chip">
              {b}
              <button onClick={() => removeBrand(b)}>✕</button>
            </span>
          ))}
        </div>
        <div className="admin__brand-input-row">
          <input
            placeholder="Nueva marca (ej: Marca 4)"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addBrand(newBrand);
                setNewBrand("");
              }
            }}
          />
          <button
            className="btn-fill"
            onClick={() => {
              addBrand(newBrand);
              setNewBrand("");
            }}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Productos */}
      <div className="admin__products-head">
        <p className="admin__panel-title">Productos ({products.length})</p>
        {!formOpen && (
          <button className="btn-fill" onClick={openCreate}>
            + Nueva pieza
          </button>
        )}
      </div>

      {formOpen && (
        <ProductForm
          initial={editing}
          brands={brands}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <div className="admin__product-list">
        {products.map((p) => (
          <div key={p.id} className="admin__product-row">
            <div className="admin__product-thumb">
              {p.images?.length ? <img src={p.images[0]} alt="" /> : <PieceIcon type={p.icon} className="admin__product-icon" />}
            </div>
            <div className="admin__product-info">
              <p className="admin__product-name">{p.name}</p>
              <p className="admin__product-meta">
                {p.category}
                {p.subcategory ? ` / ${p.subcategory}` : ""} · {p.brand} · US$ {p.price.toLocaleString()}
                {p.originalPrice ? ` (antes US$ ${p.originalPrice.toLocaleString()})` : ""}
              </p>
            </div>
            <button className="admin__edit-btn" onClick={() => openEdit(p)}>
              Editar
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
                  Sí, eliminar
                </button>
                <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
              </span>
            ) : (
              <button className="admin__delete-btn" onClick={() => setConfirmDeleteId(p.id)}>
                Eliminar
              </button>
            )}
          </div>
        ))}
        {products.length === 0 && <p className="admin__empty">No hay productos cargados.</p>}
      </div>
    </div>
  );
}
