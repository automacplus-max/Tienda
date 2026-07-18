// src/components/Sidebar.jsx
// Menú lateral deslizante (equivalente al "SideMenu" de doblem, adaptado a
// la estética y a los datos de RAIDEN): categorías, marcas, idioma/moneda
// y modo oscuro, todo en un mismo panel accesible desde el header.
import React from "react";
import SunMoonIcon from "./icons/SunMoonIcon.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { LOCALES } from "../utils/translations.js";
import "../styles/sidebar.css";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, categories, brands, goToCategory, goToBrand, theme, setTheme, lang, setLang } = useStore();

  function close() {
    setSidebarOpen(false);
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
          {categories.map((cat) => (
            <button key={cat} className="sidebar-drawer__link" onClick={() => goToCategory(cat)}>
              {cat}
            </button>
          ))}
        </nav>

        {brands.length > 0 && (
          <nav className="sidebar-drawer__section">
            <p className="sidebar-drawer__label">Marcas</p>
            {brands.map((b) => (
              <button key={b} className="sidebar-drawer__link" onClick={() => goToBrand(b)}>
                {b}
              </button>
            ))}
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
