// src/components/Sidebar.jsx
// Menú lateral deslizante (equivalente al "SideMenu" de doblem, adaptado a
// la estética y a los datos de RAIDEN): categorías con subcategorías
// desplegables, marcas, idioma/moneda y modo oscuro.
import React, { useEffect, useState } from "react";
import SunMoonIcon from "./icons/SunMoonIcon.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { LOCALES } from "../utils/translations.js";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, categories, brands, goToCategory, goToBrand, theme, setTheme, lang, setLang } = useStore();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!sidebarOpen) setExpanded(null);
  }, [sidebarOpen]);

  function close() {
    setSidebarOpen(false);
  }

  function toggleExpand(catId) {
    setExpanded((prev) => (prev === catId ? null : catId));
  }

  return (
    <>
      <div className={`sidebar-scrim ${sidebarOpen ? "is-open" : ""}`} onClick={close} />
      <aside className={`sidebar-drawer ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-drawer__head">
          <span className="sidebar-drawer__title">Menú</span>
          <button className="sidebar-drawer__close" onClick={close} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="sidebar-drawer__section">
          <p className="sidebar-drawer__label">Categorías</p>
          <button className="sidebar-drawer__link" onClick={() => goToCategory("Todo")}>
            Todo
          </button>
          {categories.map((cat) => (
            <div key={cat.id} className="sidebar-drawer__cat">
              <button
                className="sidebar-drawer__cat-head"
                onClick={() => (cat.subcategories.length ? toggleExpand(cat.id) : goToCategory(cat.id))}
              >
                <span onClick={(e) => { if (cat.subcategories.length) { e.stopPropagation(); goToCategory(cat.id); } }}>
                  {cat.label}
                </span>
                {cat.subcategories.length > 0 && (
                  <span className={`sidebar-drawer__chev ${expanded === cat.id ? "is-open" : ""}`}>▾</span>
                )}
              </button>
              {expanded === cat.id && cat.subcategories.length > 0 && (
                <div className="sidebar-drawer__subs">
                  {cat.subcategories.map((sub) => (
                    <button key={sub} className="sidebar-drawer__sub" onClick={() => goToCategory(cat.id, sub)}>
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {brands.length > 0 && (
          <nav className="sidebar-drawer__section">
            <div className="sidebar-drawer__cat">
              <button className="sidebar-drawer__cat-head" onClick={() => toggleExpand("__brands")}>
                <span>Marcas</span>
                <span className={`sidebar-drawer__chev ${expanded === "__brands" ? "is-open" : ""}`}>▾</span>
              </button>
              {expanded === "__brands" && (
                <div className="sidebar-drawer__subs">
                  {brands.map((b) => (
                    <button key={b} className="sidebar-drawer__sub" onClick={() => goToBrand(b)}>
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        <div className="sidebar-drawer__foot">
          <div className="sidebar-drawer__lang">
            {Object.entries(LOCALES).map(([code, l]) => (
              <button
                key={code}
                className={`sidebar-drawer__lang-btn ${code === lang ? "is-active" : ""}`}
                onClick={() => setLang(code)}
              >
                {l.flag} {l.currency}
              </button>
            ))}
          </div>
          <button className="sidebar-drawer__theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <SunMoonIcon dark={theme === "dark"} className="sidebar-drawer__theme-icon" />
            {theme === "light" ? "Modo oscuro" : "Modo claro"}
          </button>
        </div>
      </aside>
    </>
  );
}
