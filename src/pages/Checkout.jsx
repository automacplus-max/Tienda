// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/cart.css";

export default function Checkout() {
  const { cart, cartTotal, fmt, t, navigate, confirmOrder } = useStore();
  const [form, setForm] = useState({ nombre: "", email: "", direccion: "", ciudad: "" });
  const valid = form.nombre && form.email && form.direccion && form.ciudad;

  const fields = [
    { key: "nombre", label: t("fullName") },
    { key: "email", label: t("email") },
    { key: "direccion", label: t("address") },
    { key: "ciudad", label: t("city") },
  ];

  return (
    <div className="cart">
      <button className="cart__back" onClick={() => navigate("cart")}>
        {t("backToSelection")}
      </button>
      <h1 className="cart__title">{t("formalize")}</h1>

      <div className="checkout__grid">
        <div className="checkout__form">
          {fields.map((f) => (
            <div key={f.key} className="checkout__field">
              <label>{f.label}</label>
              <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="checkout__field">
            <label>{t("payment")}</label>
            <div className="checkout__payment-note">{t("paymentNote")}</div>
          </div>
        </div>

        <div>
          <div className="checkout__summary">
            <p className="checkout__summary-title">{t("summary")}</p>
            {cart.map((item) => (
              <div key={item.cartKey} className="checkout__summary-row">
                <span>{item.name}</span>
                <span>{fmt(item.price)}</span>
              </div>
            ))}
            <div className="checkout__summary-total">
              <span>{t("total")}</span>
              <span>{fmt(cartTotal)}</span>
            </div>
          </div>

          <button disabled={!valid} className="btn-fill checkout__confirm" onClick={confirmOrder}>
            {t("confirmPurchase")}
          </button>
        </div>
      </div>
    </div>
  );
}
