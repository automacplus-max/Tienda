// src/utils/persistedState.js
// Persiste el catálogo (productos, marcas, categorías) en localStorage para
// que los cambios del panel admin sobrevivan a un recargado de página —
// Supabase no tiene los permisos (RLS) configurados para escribir todavía,
// así que esta es la fuente de verdad real mientras tanto.
import { useEffect, useState } from "react";

export function readPersisted(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => readPersisted(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage lleno o no disponible (modo privado) — el cambio queda solo en memoria.
    }
  }, [key, state]);

  return [state, setState];
}
