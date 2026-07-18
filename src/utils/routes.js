// src/utils/routes.js
// Mapeo entre el estado de navegación de la app (view/producto/categoría/
// marca) y una URL real, para que el botón atrás/adelante del navegador
// funcione y cada sección tenga su propio link.

export function buildPath({ view, productId, category, subcategory, brand }) {
  if (view === "detail" && productId) return `/producto/${encodeURIComponent(productId)}`;
  if (view === "favorites") return "/favoritos";
  if (view === "cart") return "/seleccion";
  if (view === "checkout") return "/checkout";
  if (view === "confirmed") return "/confirmacion";
  if (view === "admin") return "/admin";

  // catalog
  if (brand && brand.size > 0) {
    return `/marca/${encodeURIComponent([...brand][0])}`;
  }
  if (category && category !== "Todo") {
    const base = `/categoria/${encodeURIComponent(category)}`;
    return subcategory ? `${base}/${encodeURIComponent(subcategory)}` : base;
  }
  return "/";
}

export function parsePath(pathname) {
  const parts = pathname.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts[0] === "producto" && parts[1]) return { view: "detail", productId: parts[1] };
  if (parts[0] === "favoritos") return { view: "favorites" };
  if (parts[0] === "seleccion") return { view: "cart" };
  if (parts[0] === "checkout") return { view: "checkout" };
  if (parts[0] === "confirmacion") return { view: "confirmed" };
  if (parts[0] === "admin") return { view: "admin" };
  if (parts[0] === "categoria" && parts[1]) return { view: "catalog", category: parts[1], subcategory: parts[2] || null };
  if (parts[0] === "marca" && parts[1]) return { view: "catalog", brand: parts[1] };
  return { view: "catalog" };
}
