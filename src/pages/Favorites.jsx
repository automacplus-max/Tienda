// src/pages/Favorites.jsx
import React from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function Favorites() {
  const { favProducts, t, navigate } = useStore();

  return (
    <div className="home">
      <main className="home__main">
        <h1 className="home__title home__title--small">{t("yourFavorites")}</h1>

        {favProducts.length === 0 ? (
          <div className="home__empty-block">
            <p className="home__empty">{t("noFavorites")}</p>
            <button className="btn-fill" onClick={() => navigate("catalog")}>
              {t("seeCuration")}
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {favProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
