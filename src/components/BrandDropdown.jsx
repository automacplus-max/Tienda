// src/components/BrandDropdown.jsx
import React from "react";
import Dropdown from "./Dropdown.jsx";
import { useStore } from "../context/StoreContext.jsx";

export default function BrandDropdown({ selectedBrands, toggleBrand }) {
  const { brands, t } = useStore();
  const label =
    selectedBrands.size === 0
      ? t("allBrands")
      : `${selectedBrands.size} marca${selectedBrands.size > 1 ? "s" : ""}`;

  return (
    <Dropdown label={label}>
      {brands.map((b) => (
        <button key={b} onClick={() => toggleBrand(b)} className="dropdown__option dropdown__option--checkbox">
          <span className={`dropdown__checkbox ${selectedBrands.has(b) ? "is-checked" : ""}`}>
            {selectedBrands.has(b) && "✓"}
          </span>
          {b}
        </button>
      ))}
    </Dropdown>
  );
}
