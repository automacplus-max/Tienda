// src/components/Gate.jsx
import React, { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function Gate() {
  const { t, setGateOpen, setAuthOpen } = useStore();
  const [leaving, setLeaving] = useState(false);

  function enterAsGuest() {
    setLeaving(true);
    setTimeout(() => setGateOpen(false), 600);
  }

  function goToLogin() {
    setLeaving(true);
    setTimeout(() => setAuthOpen(true), 500);
  }

  return (
    <div className={`gate ${leaving ? "gate--leaving" : ""}`}>
      <p className="gate__eyebrow">{t("inviteTag")}</p>
      <h1 className="gate__wordmark">RAIDEN</h1>
      <p className="gate__tagline">{t("brandTag")}</p>

      <div className="gate__actions">
        <button className="gate__btn gate__btn--primary" onClick={goToLogin}>
          {t("login")}
        </button>
        <button className="gate__btn gate__btn--outline" onClick={enterAsGuest}>
          {t("guest")}
        </button>
      </div>

      <p className="gate__note">{t("accessNote")}</p>
    </div>
  );
}
