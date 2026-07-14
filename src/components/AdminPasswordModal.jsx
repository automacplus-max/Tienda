// src/components/AdminPasswordModal.jsx
import React, { useState } from "react";

export default function AdminPasswordModal({ onClose, onSubmit }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function submit() {
    const ok = onSubmit(pass);
    if (!ok) setError(true);
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
          onChange={(e) => {
            setPass(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className={`modal__input ${error ? "modal__input--error" : ""}`}
          autoFocus
        />
        {error && <p className="modal__error">Contraseña incorrecta.</p>}
        <button onClick={submit} className="modal__submit">
          Ingresar
        </button>
        <button onClick={onClose} className="modal__cancel">
          Cancelar
        </button>
      </div>
    </div>
  );
}
