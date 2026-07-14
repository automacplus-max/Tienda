// src/pages/ProductDetail.jsx
import React, { useState } from "react";
import PieceIcon from "../components/icons/PieceIcon.jsx";
import HeartIcon from "../components/icons/HeartIcon.jsx";
import StarIcon from "../components/icons/StarIcon.jsx";
import { getDiscountPercent } from "../utils/currency.js";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/detail.css";

export default function ProductDetail() {
  const { selectedProduct: product, fmt, t, favorites, toggleFavorite, addToCart, navigate, purchased, reviewsExtra, addReview, user } = useStore();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [heartBump, setHeartBump] = useState(false);
  const [addPulse, setAddPulse] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(() =>
    product ? Object.fromEntries((product.variants || []).map((v) => [v.type, v.values[0]])) : {}
  );

  if (!product) {
    return (
      <div className="detail detail--empty">
        <p>No se encontró la pieza.</p>
        <button className="btn-fill" onClick={() => navigate("catalog")}>
          {t("backToRoomBtn")}
        </button>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const isFavorite = favorites.has(product.id);
  const isPurchased = purchased.has(product.id);
  const allReviews = [...product.reviews, ...(reviewsExtra[product.id] || [])];
  const avgRating = allReviews.length ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : null;

  function handleHeart() {
    toggleFavorite(product.id);
    setHeartBump(true);
    setTimeout(() => setHeartBump(false), 260);
  }

  function handleAdd() {
    addToCart(product, selectedVariants);
    setAddPulse(true);
    setTimeout(() => setAddPulse(false), 260);
  }

  function submitReview() {
    const author = user?.name || guestName || "Anónimo";
    if (!rating || !comment.trim()) return;
    addReview(product.id, { author, rating, comment: comment.trim() });
    setRating(0);
    setComment("");
    setGuestName("");
  }

  return (
    <div className="detail">
      <button className="detail__back" onClick={() => navigate("catalog")}>
        {t("backToRoom")}
      </button>

      <div className="detail__grid">
        <div>
          <div className="detail__image-frame">
            <button
              className={`detail__favorite ${isFavorite ? "is-active" : ""} ${heartBump ? "is-bumping" : ""}`}
              onClick={handleHeart}
            >
              <HeartIcon filled={isFavorite} className="detail__favorite-icon" />
            </button>
            {product.images?.length ? (
              <img src={product.images[activeImage]} alt={product.name} />
            ) : (
              <PieceIcon type={product.icon} className="detail__icon" />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="detail__thumbnails">
              {product.images.map((img, i) => (
                <button key={i} className={`detail__thumb ${i === activeImage ? "is-active" : ""}`} onClick={() => setActiveImage(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {/* Precio primero, protagonista */}
          {discount ? (
            <div className="detail__price-block">
              <p className="detail__original-price">{fmt(product.originalPrice)}</p>
              <div className="detail__price-row">
                <span className="detail__final-price">{fmt(product.price)}</span>
                <span className="detail__discount">-{discount}% OFF</span>
              </div>
            </div>
          ) : (
            <p className="detail__final-price detail__final-price--standalone">{fmt(product.price)}</p>
          )}

          {product.badge && <span className="detail__badge">{product.badge}</span>}

          <p className="detail__category">{product.category}</p>
          <h1 className="detail__title">{product.name}</h1>
          <p className="detail__origin">{product.origin}</p>

          {avgRating && (
            <div className="detail__rating">
              <div className="detail__stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon key={n} filled={n <= Math.round(avgRating)} className="detail__star" />
                ))}
              </div>
              <span className="detail__rating-count">
                {avgRating} · {allReviews.length} {t("opinions").toLowerCase()}
              </span>
            </div>
          )}

          <p className="detail__desc">{product.desc}</p>

          <div className="detail__info-grid">
            <div>
              <p className="detail__info-label">{t("condition")}</p>
              <p className="detail__info-value">{t("conditionValue")}</p>
            </div>
            <div>
              <p className="detail__info-label">{t("authentication")}</p>
              <p className="detail__info-value detail__info-value--accent">{t("certifiedBy")}</p>
            </div>
          </div>

          {product.variants?.length > 0 && (
            <div className="detail__variants">
              {product.variants.map((v) => (
                <div key={v.type} className="detail__variant-group">
                  <p className="detail__info-label">{v.type}</p>
                  <div className="detail__variant-options">
                    {v.values.map((val) => (
                      <button
                        key={val}
                        className={`detail__variant-chip ${selectedVariants[v.type] === val ? "is-active" : ""}`}
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [v.type]: val }))}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className={`btn-action detail__add-btn ${addPulse ? "is-pulsing" : ""}`} onClick={handleAdd}>
            {t("addToCart")}
          </button>

          <p className="detail__shipping-note">📦 {t("arrivesTomorrow")}</p>

          <div className="detail__trust-row">
            <div className="detail__trust-item">
              <p>🚚</p>
              <span>{t("freeShipping")}</span>
            </div>
            <div className="detail__trust-item">
              <p>↩️</p>
              <span>{t("freeReturns")}</span>
            </div>
            <div className="detail__trust-item">
              <p>🛡️</p>
              <span>{t("protectedPurchase")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="detail__reviews">
        <h2 className="detail__reviews-title">
          {t("opinions")} {allReviews.length > 0 && `(${allReviews.length})`}
        </h2>

        {allReviews.length === 0 ? (
          <p className="detail__no-reviews">{t("noOpinions")}</p>
        ) : (
          <div className="detail__review-list">
            {allReviews.map((r, i) => (
              <div key={i} className="detail__review">
                <div className="detail__review-head">
                  <div className="detail__stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} filled={n <= r.rating} className="detail__star detail__star--small" />
                    ))}
                  </div>
                  <span className="detail__review-author">{r.author}</span>
                </div>
                <p className="detail__review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="detail__review-form-wrap">
          {isPurchased ? (
            <div className="detail__review-form">
              <p className="detail__info-label">{t("leaveOpinion")}</p>
              <div className="detail__stars detail__stars--input">
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    filled={n <= (hoverRating || rating)}
                    className="detail__star detail__star--input"
                    onClick={() => setRating(n)}
                  />
                ))}
              </div>
              {!user && (
                <input
                  placeholder={t("yourName")}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="detail__input"
                />
              )}
              <textarea
                placeholder={t("opinionPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="detail__textarea"
              />
              <button className="btn-fill" onClick={submitReview}>
                {t("publishOpinion")}
              </button>
            </div>
          ) : (
            <p className="detail__must-buy">{t("mustBuyToReview")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
