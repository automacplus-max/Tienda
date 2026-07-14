// src/pages/Cart.jsx
import React from "react";
import PieceIcon from "../components/icons/PieceIcon.jsx";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/cart.css";

export default function Cart() {
  const { cart, cartTotal, fmt, t, removeFromCart, navigate } = useStore();

  if (cart.length === 0) {
    return (
      <div className="cart cart--empty">
        <p className="cart__empty-title">{t("emptySelection")}</p>
        <p className="cart__empty-sub">{t("emptySelectionSub")}</p>
        <button className="btn-fill" onClick={() => navigate("catalog")}>
          {t("seeCuration")}
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1 className="cart__title">{t("yourSelection")}</h1>

      <div className="cart__list">
        {cart.map((item) => (
          <div key={item.cartKey} className="cart__item">
            <div className="cart__item-image">
              {item.images?.length ? <img src={item.images[0]} alt={item.name} /> : <PieceIcon type={item.icon} className="cart__item-icon" />}
            </div>
            <div className="cart__item-info">
              <p className="cart__item-name">{item.name}</p>
              <p className="cart__item-meta">
                {item.category}
                {item.selectedVariants &&
                  Object.entries(item.selectedVariants).length > 0 &&
                  ` · ${Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}`}
              </p>
            </div>
            <p className="cart__item-price">{fmt(item.price)}</p>
            <button className="cart__item-remove" onClick={() => removeFromCart(item.cartKey)}>
              {t("remove")}
            </button>
          </div>
        ))}
      </div>

      <div className="cart__summary">
        <div>
          <p className="cart__summary-label">{t("total")}</p>
          <p className="cart__summary-total">{fmt(cartTotal)}</p>
        </div>
        <button className="btn-fill" onClick={() => navigate("checkout")}>
          {t("proceedToBuy")}
        </button>
      </div>
    </div>
  );
}
