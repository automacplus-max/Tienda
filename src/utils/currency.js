// src/utils/currency.js
// Misma lógica de descuento y formato de precio que tenía el prototipo original,
// solo que ahora vive en un solo lugar en vez de repetirse en cada componente.

const UYU_RATE = 40; // tasa de referencia aproximada, no es una cotización en vivo

export function formatPrice(usdAmount, currency) {
  if (currency === "USD") {
    return `US$ ${usdAmount.toLocaleString("en-US")}`;
  }
  const uyu = Math.round(usdAmount * UYU_RATE);
  return `UYU$ ${uyu.toLocaleString("es-UY")}`;
}

export function getDiscountPercent(price, originalPrice) {
  if (!originalPrice) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
