// src/components/icons/SunMoonIcon.jsx
import React from "react";

export default function SunMoonIcon({ dark, className }) {
  return dark ? (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20 14.5 A8.5 8.5 0 1 1 9.5 4 A7 7 0 0 0 20 14.5 Z" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5 L12 5 M12 19 L12 21.5 M21.5 12 L19 12 M5 12 L2.5 12 M18.4 5.6 L16.6 7.4 M7.4 16.6 L5.6 18.4 M18.4 18.4 L16.6 16.6 M7.4 7.4 L5.6 5.6" />
    </svg>
  );
}
