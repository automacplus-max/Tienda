// src/components/icons/MenuIcon.jsx
import React from "react";

export default function MenuIcon({ open, className }) {
  return open ? (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M5 5 L19 19 M19 5 L5 19" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" strokeLinecap="round" />
    </svg>
  );
}
