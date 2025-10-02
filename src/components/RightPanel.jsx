import React, { useState } from "react";

export default function RightPanel() {
  const [mensajes, setMensajes] = useState([
    { id: 1, autor: "Sistema", texto: "Bienvenido al chat 👋" },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === "") return;

    const mensaje = {
      id: Date.now(),
      autor: "Tú",
      texto: nuevoMensaje,
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje("");
  };

  return (
    <aside className="right-panel">
      <h3 className="chat-title">Chat rápido</h3>

      <div className="chat-box">
        {mensajes.map((m) => (
          <div key={m.id} className="chat-msg">
            <strong>{m.autor}:</strong> {m.texto}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={nuevoMensaje}
          placeholder="Escribe un mensaje..."
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </aside>
  );
}
