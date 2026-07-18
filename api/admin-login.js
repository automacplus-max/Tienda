import crypto from "crypto";
import { signSession } from "./_lib/adminAuth.js";

// Compara en tiempo constante hasheando ambas strings primero, así la
// duración de la comparación no revela nada sobre dónde difieren.
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user, pass } = req.body || {};
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass) {
    console.error("admin-login: faltan ADMIN_USER / ADMIN_PASSWORD en el servidor");
    return res.status(500).json({ error: "Admin login no está configurado." });
  }

  const isAdmin = safeEqual(user || "", adminUser) && safeEqual(pass || "", adminPass);
  if (!isAdmin) return res.status(401).json({ error: "Contraseña incorrecta." });

  try {
    return res.status(200).json({ token: signSession("admin") });
  } catch (err) {
    console.error("admin-login error", err);
    return res.status(500).json({ error: "No se pudo iniciar sesión." });
  }
}
