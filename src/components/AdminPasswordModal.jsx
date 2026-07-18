// src/components/AdminPasswordModal.jsx
import React, { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function AdminPasswordModal({ onClose }) {
  const { loginAdmin, adminLoginError, adminLoginLoading } = useStore();
  const [pass, setPass] = useState("");

  function submit() {
    if (!pass || adminLoginLoading) return;
    loginAdmin(pass);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="modal__title">Acceso administradores</p>
        <p className="modal__subtitle">Ingresá la contraseña para gestionar el catálogo.</p>
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`modal__input ${adminLoginError ? "modal__input--error" : ""}`}
          autoFocus
        />
        {adminLoginError && <p className="modal__error">{adminLoginError}</p>}
        <button onClick={submit} disabled={adminLoginLoading} className="modal__submit">
          {adminLoginLoading ? "Verificando…" : "Ingresar"}
        </button>
        <button onClick={onClose} className="modal__cancel">
          Cancelar
        </button>
      </div>
    </div>
  );
}
