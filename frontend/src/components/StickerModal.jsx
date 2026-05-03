import { useContext, useEffect } from "react";
import { CollectionContext } from "../context/CollectionContext";
import "../styles/StickerModal.css";

export default function StickerModal({ sticker, onClose }) {
  const { setQuantity } = useContext(CollectionContext);
  const { id, code, name, owned, repeated_count, type, country } = sticker;

  // quantity: 0=no tengo, 1=tengo, 2=tengo+1rep, N=tengo+(N-1)rep
  const quantity = owned ? repeated_count + 1 : 0;

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // + suma 1
  const handleAdd = () => setQuantity(id, quantity + 1);

  // - resta 1 (si llega a 0, desmarca)
  const handleRemove = () => {
    if (quantity === 0) return;
    setQuantity(id, quantity - 1);
  };

  const typeLabel = {
    jugador:     "Jugador",
    escudo:      "Escudo",
    foto_equipo: "Foto equipo",
    especial:    "Especial",
    historico:   "Histórico",
    estadio:     "Estadio",
  }[type] || type;

  const accentColor = !owned
    ? "#555"
    : repeated_count > 0
    ? "var(--fwc-orange)"
    : "var(--fwc-green)";

  const statusLabel = !owned
    ? "No la tengo"
    : repeated_count === 0
    ? "✓ La tengo"
    : `✓ La tengo · ${repeated_count} repetida${repeated_count > 1 ? "s" : ""}`;

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-card" onClick={e => e.stopPropagation()}>

        <div className="sm-bg-deco" style={{ background: accentColor }} />

        <button className="sm-close" onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Código grande */}
        <div className="sm-code-wrap">
          <span className="sm-code">{code}</span>
          <span className="sm-type-tag">{typeLabel}</span>
        </div>

        <div className="sm-name">{name}</div>
        {country && <div className="sm-country">{country}</div>}

        <div className="sm-divider" />

        <div className="sm-status" style={{ color: accentColor }}>
          {statusLabel}
        </div>

        {/* Controles + cantidad - */}
        <div className="sm-controls">
          <button
            className="sm-btn sm-btn--minus"
            onClick={handleRemove}
            disabled={quantity === 0}
            aria-label="Quitar una"
          >
            −
          </button>

          <div className="sm-quantity-wrap">
            <span className="sm-quantity">{quantity}</span>
            <span className="sm-quantity-lbl">
              {quantity === 0 && "no tengo"}
              {quantity === 1 && "tengo"}
              {quantity >= 2 && `×${quantity}`}
            </span>
          </div>

          <button
            className="sm-btn sm-btn--plus"
            onClick={handleAdd}
            aria-label="Agregar una"
          >
            +
          </button>
        </div>

        <p className="sm-hint">
          Toca fuera o <kbd>Esc</kbd> para cerrar
        </p>
      </div>
    </div>
  );
}