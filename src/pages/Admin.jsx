// src/pages/Admin.jsx
import React, { useState } from "react";
import ProductForm from "../components/ProductForm.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import BrandManager from "../components/BrandManager.jsx";
import CategoryManager from "../components/CategoryManager.jsx";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/admin.css";

const TABS = [
  { id: "products", label: "Productos" },
  { id: "brands", label: "Marcas" },
  { id: "categories", label: "Categorías" },
];

export default function Admin() {
  const { products, brands, categories, saveProduct, navigate, nextId, logoutAdmin } = useStore();
  const [tab, setTab] = useState("products");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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

      <nav className="admin__tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`admin__tab ${tab === t.id ? "is-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="admin__main">
        {tab === "products" && (
          <>
            {!formOpen && (
              <div className="admin__products-head">
                <p className="admin__panel-title">Productos ({products.length})</p>
                <button className="btn-fill" onClick={openCreate}>
                  + Nueva pieza
                </button>
              </div>
            )}

            {formOpen ? (
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
            ) : (
              <ProductGrid products={products} onEdit={openEdit} />
            )}
          </>
        )}

        {tab === "brands" && <BrandManager />}
        {tab === "categories" && <CategoryManager />}
      </div>
    </div>
  );
}
