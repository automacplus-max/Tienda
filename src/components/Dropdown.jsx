// src/components/Dropdown.jsx
import React, { useState } from "react";

export default function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dropdown">
      <button className="dropdown__trigger" onClick={() => setOpen((o) => !o)}>
        {label} <span className={`dropdown__arrow ${open ? "is-open" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="dropdown__menu" onMouseLeave={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}
