// src/components/ProductCard.jsx
import React, { useState } from "react";
import PieceIcon from "./icons/PieceIcon.jsx";
import HeartIcon from "./icons/HeartIcon.jsx";
import { getDiscountPercent } from "../utils/currency.js";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/product.css";

export default function ProductCard({ product }) {
  const { fmt, favorites, toggleFavorite, navigate } = useStore();
  const [heartBump, setHeartBump] = useState(false);

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const isFavorite = favorites.has(product.id);

  function handleFavorite(e) {
    e.stopPropagation();
    toggleFavorite(product.id);
    setHeartBump(true);
    setTimeout(() => setHeartBump(false), 260);
  }

  return (
    <div className="product-card" onClick={() => navigate("detail", product.id)}>
      {product.badge && <span className="product-card__badge">{product.badge}</span>}

      <button
        type="button"
        className={`product-card__favorite ${isFavorite ? "is-active" : ""} ${heartBump ? "is-bumping" : ""}`}
        onClick={handleFavorite}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <HeartIcon filled={isFavorite} className="product-card__favorite-icon" />
      </button>

      <div className="product-card__image">
        {product.images?.length ? (
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        ) : (
          <PieceIcon type={product.icon} className="product-card__icon" />
        )}
      </div>

      {/*
        Bloque de precio con altura reservada (ver product.css): un producto
        sin descuento ocupa el mismo alto que uno con descuento, para que
        ninguna card salte de tamaño dentro de la misma fila.
      */}
      <div className="product-card__price-block">
        <p className="product-card__original-price">
          {product.originalPrice ? fmt(product.originalPrice) : "\u00A0"}
        </p>
        <div className="product-card__price-row">
          <span className="product-card__final-price">{fmt(product.price)}</span>
          <span className={`product-card__discount ${discount ? "" : "product-card__discount--hidden"}`}>
            {discount ? `-${discount}%` : "\u00A0"}
          </span>
        </div>
      </div>

      <h3 className="product-card__title">{product.name}</h3>
      <p className="product-card__origin">{product.origin}</p>
    </div>
  );
}
