// src/components/icons/PieceIcon.jsx
import React from "react";

const COMMON = { fill: "none", stroke: "currentColor", strokeWidth: 0.9, strokeLinecap: "round", strokeLinejoin: "round" };

const PATHS = {
  bag: (
    <>
      <path {...COMMON} d="M55 85 L145 85 L152 175 L48 175 Z" />
      <path {...COMMON} d="M75 85 C75 55 125 55 125 85" />
      <rect {...COMMON} x="90" y="115" width="20" height="14" rx="2" />
    </>
  ),
  watch: (
    <>
      <circle {...COMMON} cx="100" cy="100" r="38" />
      <circle cx="100" cy="100" r="2" fill="currentColor" stroke="none" />
      <path {...COMMON} d="M100 78 L100 100 L116 110" />
      <path {...COMMON} d="M88 62 L112 62 L112 45 L88 45 Z" />
      <path {...COMMON} d="M88 138 L112 138 L112 155 L88 155 Z" />
    </>
  ),
  ring: (
    <>
      <circle {...COMMON} cx="100" cy="120" r="34" />
      <path {...COMMON} d="M85 88 L100 60 L115 88 Z" />
      <circle {...COMMON} cx="100" cy="80" r="4" />
    </>
  ),
  coat: (
    <>
      <path {...COMMON} d="M75 42 L100 58 L125 42 L152 58 L162 92 L146 100 L146 172 L54 172 L54 100 L38 92 Z" />
      <path {...COMMON} d="M100 58 L88 172" />
      <path {...COMMON} d="M100 58 L112 172" />
    </>
  ),
  necklace: (
    <>
      <path {...COMMON} d="M50 55 C50 110 150 110 150 55" />
      <circle {...COMMON} cx="100" cy="118" r="10" />
      {[...Array(9)].map((_, i) => (
        <circle key={i} cx={58 + i * 10.5} cy={55 + Math.sin((i / 8) * Math.PI) * 42} r="2.4" fill="currentColor" stroke="none" />
      ))}
    </>
  ),
  briefcase: (
    <>
      <rect {...COMMON} x="45" y="85" width="110" height="80" rx="4" />
      <path {...COMMON} d="M80 85 L80 68 C80 60 88 55 100 55 C112 55 120 60 120 68 L120 85" />
      <path {...COMMON} d="M45 115 L155 115" />
    </>
  ),
};

export default function PieceIcon({ type, className, style }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style}>
      {PATHS[type] || PATHS.bag}
    </svg>
  );
}
