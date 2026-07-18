// El cliente solo decodifica "exp:role" del token para decidir qué UI
// mostrar — no puede (ni necesita) verificar la firma HMAC sin el secreto,
// que nunca sale del servidor. Un token con firma inválida simplemente
// nunca pudo haber sido emitido por /api/admin-login.
const STORAGE_KEY = "raiden-admin-token";

export function readStoredToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // localStorage no disponible (modo privado, etc.) — la sesión no persiste entre recargas.
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

export function isTokenValid(token) {
  if (!token) return false;
  const [payload] = token.split(".");
  if (!payload) return false;
  const [expStr] = payload.split(":");
  const exp = Number(expStr);
  return Boolean(exp) && exp > Date.now();
}
