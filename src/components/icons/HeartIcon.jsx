// src/components/icons/HeartIcon.jsx
import React from "react";

export default function HeartIcon({ filled, className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 20.5 C12 20.5 3.5 15.2 3.5 9.2 C3.5 6.2 5.8 4 8.6 4 C10.3 4 11.6 4.9 12 5.9 C12.4 4.9 13.7 4 15.4 4 C18.2 4 20.5 6.2 20.5 9.2 C20.5 15.2 12 20.5 12 20.5 Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
