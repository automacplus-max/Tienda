// src/pages/Confirmed.jsx
import React, { useMemo } from "react";
import { useStore } from "../context/StoreContext.jsx";
import "../styles/cart.css";

export default function Confirmed() {
  const { t, navigate } = useStore();
  const orderNum = useMemo(() => `RAI-${Math.floor(1000 + Math.random() * 9000)}`, []);

  return (
    <div className="cart cart--empty">
      <div className="confirmed__check">✓</div>
      <p className="confirmed__tag">{t("purchaseConfirmed")}</p>
      <h1 className="cart__empty-title">
        {orderNum} {t("processing")}
      </h1>
      <p className="cart__empty-sub">{t("demoNote")}</p>
      <p className="confirmed__note">{t("reviewNote")}</p>
      <button className="btn-fill" onClick={() => navigate("catalog")}>
        {t("backToRoomBtn")}
      </button>
    </div>
  );
}
