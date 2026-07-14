// src/App.jsx
import React from "react";
import { StoreProvider, useStore } from "./context/StoreContext.jsx";
import Gate from "./components/Gate.jsx";
import AuthModal from "./components/AuthModal.jsx";
import AdminPasswordModal from "./components/AdminPasswordModal.jsx";
import Header from "./components/Header.jsx";
import Toast from "./components/Toast.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Favorites from "./pages/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Confirmed from "./pages/Confirmed.jsx";
import Admin from "./pages/Admin.jsx";

function AppShell() {
  const { theme, gateOpen, authOpen, setAuthOpen, authReason, handleLogin, authInitializing, adminModalOpen, setAdminModalOpen, loginAdmin, view, adminAuth } = useStore();

  if (authInitializing) {
    return (
      <div className={`raiden-app ${theme === "dark" ? "dark" : ""}`}>
        <div className="auth-loading">Cargando…</div>
      </div>
    );
  }

  return (
    <div className={`raiden-app ${theme === "dark" ? "dark" : ""}`}>
      {gateOpen && <Gate />}

      {authOpen && <AuthModal reason={authReason} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}

      {adminModalOpen && <AdminPasswordModal onClose={() => setAdminModalOpen(false)} onSubmit={loginAdmin} />}

      {!gateOpen && (
        <>
          <Header />
          <Toast />

          <main className="app-main">
            {view === "catalog" && <Home />}
            {view === "detail" && <ProductDetail />}
            {view === "favorites" && <Favorites />}
            {view === "cart" && <Cart />}
            {view === "checkout" && <Checkout />}
            {view === "confirmed" && <Confirmed />}
            {view === "admin" && adminAuth && <Admin />}
          </main>

          <footer className="app-footer">
            <div className="app-footer__inner">
              <span>RAIDEN — Prototipo de demostración</span>
              <span>Cada pieza, autenticada. Cada venta, discreta.</span>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
