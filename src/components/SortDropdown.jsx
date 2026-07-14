// src/components/SortDropdown.jsx
import React from "react";
import Dropdown from "./Dropdown.jsx";
import { useStore } from "../context/StoreContext.jsx";

const SORT_KEYS = [
  { key: "relevancia", labelKey: "sortRelevance" },
  { key: "precio-asc", labelKey: "sortPriceAsc" },
  { key: "precio-desc", labelKey: "sortPriceDesc" },
  { key: "descuento", labelKey: "sortDiscount" },
];

export default function SortDropdown({ sortBy, setSortBy }) {
  const { t } = useStore();
  const current = SORT_KEYS.find((o) => o.key === sortBy);

  return (
    <Dropdown label={`${t("sortLabel")}: ${t(current.labelKey)}`}>
      {SORT_KEYS.map((o) => (
        <button
          key={o.key}
          onClick={() => setSortBy(o.key)}
          className={`dropdown__option ${o.key === sortBy ? "is-active" : ""}`}
        >
          {t(o.labelKey)}
        </button>
      ))}
    </Dropdown>
  );
}
