import crypto from "crypto";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 días

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Falta ADMIN_SESSION_SECRET en las variables de entorno del servidor.");
  return secret;
}

// El payload lleva "exp:role"; el cliente solo lo decodifica para saber qué
// UI mostrar — la verificación real (firma HMAC) ocurre acá, en el server.
export function signSession(role = "admin") {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${exp}:${role}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

// Devuelve { exp, role } si el token es válido, no expiró y la firma es
// correcta; null en cualquier otro caso.
export function verifySession(token) {
  if (!token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [expStr, role] = payload.split(":");
  const exp = Number(expStr);
  if (!exp || exp <= Date.now()) return null;
  return { exp, role: role || "admin" };
}
