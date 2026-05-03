import { useContext, useRef, useCallback, useState } from "react";
import { CollectionContext } from "../context/CollectionContext";
import StickerModal from "./StickerModal";
import "../styles/StickerCard.css";

const HOLD_MS = 500;

export default function StickerCard({ sticker }) {
  const { id, code, name, owned, repeated_count, type } = sticker;
  const { setQuantity } = useContext(CollectionContext);

  const holdTimer = useRef(null);
  const didHold   = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Solo mantener abre el modal — el clic corto no hace nada
  const startHold = useCallback(() => {
    didHold.current = false;
    holdTimer.current = setTimeout(() => {
      didHold.current = true;
      setModalOpen(true);
      if (navigator.vibrate) navigator.vibrate(60);
    }, HOLD_MS);
  }, []);

  const endHold = useCallback(() => {
    clearTimeout(holdTimer.current);
  }, []);

  // Clic corto: solo marca si NO la tiene (primera vez)
  // Si ya la tiene, no hace nada — usar el modal para cambiar cantidad
  const handleClick = useCallback(() => {
    if (didHold.current) return;
    if (!owned) {
      setQuantity(id, 1); // primera marca
    }
    // Si ya la tiene, no hace nada — abrir modal con hold
  }, [id, owned, setQuantity]);

  const handleContextMenu = (e) => e.preventDefault();

  let stateClass = "sc--missing";
  if (owned && repeated_count === 0) stateClass = "sc--owned";
  if (owned && repeated_count >  0)  stateClass = "sc--repeated";

  const isGold = type === "especial" || type === "historico";

  let typeTag = null;
  if (type === "escudo")      typeTag = "ESC";
  if (type === "foto_equipo") typeTag = "FTO";
  if (type === "especial")    typeTag = "ESP";
  if (type === "historico")   typeTag = "HIS";
  if (type === "estadio")     typeTag = "EST";

  return (
    <>
      <button
        className={`sc ${stateClass}${isGold ? " sc--gold" : ""}`}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        aria-label={`${code} ${name}`}
        title="Mantén presionado para ver opciones"
      >
        {owned && repeated_count > 0 && (
          <span className="sc-badge">+{repeated_count}</span>
        )}
        {typeTag && <span className="sc-type">{typeTag}</span>}
        <span className="sc-code">{code}</span>
        <span className="sc-name">{name}</span>
        <span className="sc-dot" />
      </button>

      {modalOpen && (
        <StickerModal
          sticker={sticker}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}