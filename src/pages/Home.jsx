// src/pages/Home.jsx
import React, { useMemo, useState } from "react";
import Filters from "../components/Filters.jsx";
import CategoryTabs from "../components/CategoryTabs.jsx";
import BrandDropdown from "../components/BrandDropdown.jsx";
import SortDropdown from "../components/SortDropdown.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getDiscountPercent } from "../utils/currency.js";
import { useStore } from "../context/StoreContext.jsx";

export default function Home() {
  const {
    products,
    t,
    searchTerm,
    categoryFilter: activeCategory,
    setCategoryFilter,
    subcategoryFilter: activeSubcategory,
    setSubcategoryFilter,
    brandFilter: selectedBrands,
    setBrandFilter: setSelectedBrands,
  } = useStore();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("relevancia");

  function selectCategory(cat) {
    setCategoryFilter(cat);
    setSubcategoryFilter(null);
  }

  function toggleBrand(b) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });
  }

  const filteredProducts = useMemo(() => {
    const min = minPrice !== "" && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
    const max = maxPrice !== "" && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;
    const term = searchTerm.trim().toLowerCase();

    let list = products.filter((p) => {
      if (p.visible === false) return false;
      const matchesSearch = term === "" || p.name.toLowerCase().includes(term);
      const matchesCategory = activeCategory === "Todo" || p.category === activeCategory;
      const matchesSubcategory = !activeSubcategory || p.subcategory === activeSubcategory;
      const matchesMin = min === null || p.price >= min;
      const matchesMax = max === null || p.price <= max;
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(p.brand);
      return matchesSearch && matchesCategory && matchesSubcategory && matchesMin && matchesMax && matchesBrand;
    });

    list = [...list];
    if (sortBy === "precio-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "precio-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "descuento")
      list.sort((a, b) => (getDiscountPercent(b.price, b.originalPrice) || 0) - (getDiscountPercent(a.price, a.originalPrice) || 0));

    return list;
  }, [products, searchTerm, activeCategory, activeSubcategory, minPrice, maxPrice, selectedBrands, sortBy]);

  return (
    <div className="home">
      <main className="home__main">
        <section className="home__intro">
          <p className="home__eyebrow">{t("curationTag")}</p>
          <h1 className="home__title">
            {t("heroLine1")}
            <br />
            {t("heroLine2")}
          </h1>
          <p className="home__desc">{t("heroDesc")}</p>
        </section>

        <CategoryTabs activeCategory={activeCategory} onSelectCategory={selectCategory} />

        <div className="home__filter-bar">
          <Filters minPrice={minPrice} maxPrice={maxPrice} onMinChange={setMinPrice} onMaxChange={setMaxPrice} />
          <BrandDropdown selectedBrands={selectedBrands} toggleBrand={toggleBrand} />
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <p className="home__count">
          {filteredProducts.length} {filteredProducts.length === 1 ? t("piece") : t("pieces")}
        </p>

        {filteredProducts.length === 0 ? (
          <p className="home__empty">{t("noMatch")}</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
