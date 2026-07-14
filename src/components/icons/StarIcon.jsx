// src/components/icons/StarIcon.jsx
import React from "react";

export default function StarIcon({ filled, className, onClick }) {
  return (
    <svg
      onClick={onClick}
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M12 3 L14.6 9.3 L21.4 9.8 L16.2 14.1 L17.9 20.7 L12 17.1 L6.1 20.7 L7.8 14.1 L2.6 9.8 L9.4 9.3 Z" strokeLinejoin="round" />
    </svg>
  );
}
