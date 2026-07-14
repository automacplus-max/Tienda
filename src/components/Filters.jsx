// src/components/Filters.jsx
import React from "react";
import { useStore } from "../context/StoreContext.jsx";

// Solo permite dígitos: evita letras y también evita el símbolo "-"
// (con lo cual un número negativo nunca llega a existir en el input).
function sanitizeNumber(value) {
  return value.replace(/[^0-9]/g, "");
}

export default function Filters({ minPrice, maxPrice, onMinChange, onMaxChange }) {
  const { t } = useStore();

  return (
    <div className="filters">
      <input
        type="text"
        inputMode="numeric"
        className="filters__input"
        placeholder={t("min")}
        value={minPrice}
        onChange={(e) => onMinChange(sanitizeNumber(e.target.value))}
        aria-label="Precio mínimo"
      />
      <span className="filters__separator">–</span>
      <input
        type="text"
        inputMode="numeric"
        className="filters__input"
        placeholder={t("max")}
        value={maxPrice}
        onChange={(e) => onMaxChange(sanitizeNumber(e.target.value))}
        aria-label="Precio máximo"
      />
    </div>
  );
}
