import React, { useState } from "react";

export default function Modals() {
  const [modalActivo, setModalActivo] = useState(null);

  const abrirModal = (tipo) => setModalActivo(tipo);
  const cerrarModal = () => setModalActivo(null);

  return (
    <div>
      {/* Botones de prueba (puedes quitarlos y controlar desde otros componentes) */}
      <div style={{ margin: "10px" }}>
        <button onClick={() => abrirModal("info")}>Abrir Info</button>
        <button onClick={() => abrirModal("avance")}>Abrir Avance</button>
        <button onClick={() => abrirModal("nuevo")}>Nuevo Proyecto</button>
      </div>

      {/* Overlay */}
      {modalActivo && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
          >
            {/* Info */}
            {modalActivo === "info" && (
              <>
                <h3>ℹ️ Información del Proyecto</h3>
                <p>Detalles completos del proyecto seleccionado.</p>
                <button onClick={cerrarModal}>Cerrar</button>
              </>
            )}

            {/* Entregar Avance */}
            {modalActivo === "avance" && (
              <>
                <h3>📤 Entregar Avance</h3>
                <textarea placeholder="Describe tu avance..."></textarea>
                <button onClick={cerrarModal}>Enviar</button>
              </>
            )}

            {/* Nuevo Proyecto */}
            {modalActivo === "nuevo" && (
              <>
                <h3>➕ Crear Nuevo Proyecto</h3>
                <input type="text" placeholder="Nombre del proyecto" />
                <input type="text" placeholder="Cliente" />
                <button onClick={cerrarModal}>Guardar</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
