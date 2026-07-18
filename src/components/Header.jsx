// src/components/Header.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar.jsx";
import HeartIcon from "./icons/HeartIcon.jsx";
import SunMoonIcon from "./icons/SunMoonIcon.jsx";
import MenuIcon from "./icons/MenuIcon.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { LOCALES } from "../utils/translations.js";
import "../styles/header.css";

export default function Header() {
  const { theme, setTheme, lang, setLang, t, cart, favorites, adminAuth, user, setAuthOpen, navigate, searchTerm, setSearchTerm, logout, sidebarOpen, setSidebarOpen } = useStore();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <button className="header__menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú">
          <MenuIcon open={sidebarOpen} className="header__menu-icon" />
        </button>

        <button className="header__logo" onClick={() => navigate("catalog")}>
          RAIDEN
        </button>

        <div className="header__search">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder={lang === "en" ? "Search pieces..." : "Buscar piezas..."} />
        </div>

        <div className="header__actions">
          <div className="header__lang">
            <button className="header__icon-btn" onClick={() => setLangMenuOpen((o) => !o)}>
              {LOCALES[lang].flag} <span className="header__lang-code">{LOCALES[lang].currency}</span>
            </button>
            {langMenuOpen && (
              <div className="header__lang-menu" onMouseLeave={() => setLangMenuOpen(false)}>
                {Object.entries(LOCALES).map(([code, l]) => (
                  <button
                    key={code}
                    className={`header__lang-option ${code === lang ? "is-active" : ""}`}
                    onClick={() => {
                      setLang(code);
                      setLangMenuOpen(false);
                    }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="header__icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Modo oscuro">
            <SunMoonIcon dark={theme === "dark"} className="header__theme-icon" />
          </button>

          <button className="header__icon-btn" onClick={() => navigate("favorites")}>
            <HeartIcon filled={favorites.size > 0} className="header__heart-icon" />
            <span className="header__count">{favorites.size}</span>
          </button>

          {adminAuth && (
            <button className="header__admin-link" onClick={() => navigate("admin")}>
              {t("adminPanel")}
            </button>
          )}

          <button className="header__cart-btn" onClick={() => navigate("cart")}>
            {t("selection")} ({cart.length})
          </button>

          {user ? (
            <button className="header__avatar" title={`${user.name} — Cerrar sesión`} onClick={logout}>
              {user.avatar ? (
                <img src={user.avatar} alt="" className="header__avatar-img" />
              ) : (
                user.name.charAt(0)
              )}
            </button>
          ) : (
            <button className="header__login-link" onClick={() => setAuthOpen(true)}>
              {t("login")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
