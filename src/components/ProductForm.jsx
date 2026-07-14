// src/components/ProductForm.jsx
import React, { useState } from "react";
import { CATEGORIES, ICONS_LIST } from "../data/products.js";

export default function ProductForm({ initial, brands, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, price: String(initial.price), originalPrice: initial.originalPrice ? String(initial.originalPrice) : "" }
      : {
          name: "",
          category: CATEGORIES[1],
          brand: brands[0] || "",
          origin: "",
          price: "",
          originalPrice: "",
          desc: "",
          icon: "bag",
          badge: "",
          images: [],
          variants: [],
        }
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVariantType, setNewVariantType] = useState("");
  const [newVariantValues, setNewVariantValues] = useState("");

  const valid = form.name.trim() && form.price && Number(form.price) > 0 && form.brand;

  function addImageUrl() {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
    setNewImageUrl("");
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ ...f, images: [...(f.images || []), reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function addVariantGroup() {
    const type = newVariantType.trim();
    const values = newVariantValues.split(",").map((v) => v.trim()).filter(Boolean);
    if (!type || values.length === 0) return;
    setForm((f) => ({ ...f, variants: [...(f.variants || []).filter((v) => v.type !== type), { type, values }] }));
    setNewVariantType("");
    setNewVariantValues("");
  }

  function removeVariantGroup(type) {
    setForm((f) => ({ ...f, variants: f.variants.filter((v) => v.type !== type) }));
  }

  function removeVariantValue(type, val) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v) => (v.type === type ? { ...v, values: v.values.filter((x) => x !== val) } : v)).filter((v) => v.values.length > 0),
    }));
  }

  function field(key, label, type = "text") {
    return (
      <div className="admin-form__field">
        <label>{label}</label>
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
      </div>
    );
  }

  function submit() {
    if (!valid) return;
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      reviews: initial?.reviews || [],
    });
  }

  return (
    <div className="admin-form">
      <p className="admin-form__title">{initial ? "Editar pieza" : "Nueva pieza"}</p>

      <div className="admin-form__grid">
        {field("name", "Nombre")}
        {field("origin", "Procedencia")}

        <div className="admin-form__field">
          <label>Categoría</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.filter((c) => c !== "Todo").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field">
          <label>Marca</label>
          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {field("price", "Precio (US$)", "number")}
        {field("originalPrice", "Precio original (opcional, para descuento)", "number")}

        <div className="admin-form__field">
          <label>Ícono</label>
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {ICONS_LIST.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field">
          <label>Etiqueta (opcional)</label>
          <select value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
            <option value="">Sin etiqueta</option>
            <option value="Envío gratis">Envío gratis</option>
            <option value="Más vendido">Más vendido</option>
            <option value="Quedan pocas unidades">Quedan pocas unidades</option>
          </select>
        </div>
      </div>

      <div className="admin-form__field admin-form__field--full">
        <label>Descripción</label>
        <textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
      </div>

      {/* Imágenes */}
      <div className="admin-form__section">
        <p className="admin-form__section-title">Imágenes ({(form.images || []).length})</p>
        {(form.images || []).length > 0 && (
          <div className="admin-form__image-list">
            {form.images.map((img, i) => (
              <div key={i} className="admin-form__image-thumb">
                <img src={img} alt="" onError={(e) => (e.currentTarget.style.opacity = 0.2)} />
                <button onClick={() => removeImage(i)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="admin-form__upload-row">
          <label className="admin-form__upload-btn">
            Subir desde tu computadora
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} hidden />
          </label>
          <span>o pegá una URL:</span>
        </div>
        <div className="admin-form__url-row">
          <input placeholder="URL de la imagen (https://...)" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addImageUrl()} />
          <button onClick={addImageUrl}>+ Agregar</button>
        </div>
        <p className="admin-form__hint">
          Las imágenes subidas desde tu compu quedan guardadas solo en esta sesión — cuando conectemos Supabase Storage, se van a guardar de verdad.
        </p>
      </div>

      {/* Variantes */}
      <div className="admin-form__section">
        <p className="admin-form__section-title">Variantes ({(form.variants || []).length})</p>
        {(form.variants || []).length > 0 && (
          <div className="admin-form__variant-list">
            {form.variants.map((v) => (
              <div key={v.type} className="admin-form__variant-group">
                <span className="admin-form__variant-type">{v.type}:</span>
                {v.values.map((val) => (
                  <span key={val} className="admin-form__variant-value">
                    {val}
                    <button onClick={() => removeVariantValue(v.type, val)}>✕</button>
                  </span>
                ))}
                <button className="admin-form__remove-group" onClick={() => removeVariantGroup(v.type)}>
                  Quitar grupo
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="admin-form__variant-inputs">
          <input placeholder="Tipo (ej: Talle, Color)" value={newVariantType} onChange={(e) => setNewVariantType(e.target.value)} />
          <input
            placeholder="Valores separados por coma (ej: S, M, L)"
            value={newVariantValues}
            onChange={(e) => setNewVariantValues(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addVariantGroup()}
          />
          <button onClick={addVariantGroup}>+ Agregar grupo</button>
        </div>
      </div>

      <div className="admin-form__actions">
        <button disabled={!valid} className="btn-fill" onClick={submit}>
          Guardar
        </button>
        <button className="btn-outline" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
