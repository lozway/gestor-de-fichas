import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";
import { ALL_STICKERS } from "../data/stickers";

export const CollectionContext = createContext(null);

export function CollectionProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [stickers, setStickers] = useState(ALL_STICKERS);
  const [loading,  setLoading]  = useState(false);

  // ── Carga inicial desde la BD ────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setStickers(ALL_STICKERS.map(s => ({ ...s, owned: false, repeated_count: 0 })));
      return;
    }
    setLoading(true);
    api.get("/stickers/collection")
      .then(({ data }) => {
        const ownedMap = {};
        data.stickers.forEach(({ sticker_id, quantity }) => {
          ownedMap[sticker_id] = quantity;
        });
        setStickers(
          ALL_STICKERS.map(s => {
            const qty = ownedMap[s.code] ?? 0;
            return { ...s, owned: qty > 0, repeated_count: qty > 1 ? qty - 1 : 0 };
          })
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // ── setQuantity: función central que controla todo ───────────────
  // quantity = 0 → no la tiene
  // quantity = 1 → la tiene sin repetidas
  // quantity = 2 → la tiene + 1 repetida
  // quantity = N → la tiene + (N-1) repetidas
  const setQuantity = useCallback(async (stickerId, quantity) => {
    const qty = Math.max(0, quantity);

    // Actualización optimista inmediata
    setStickers(prev =>
      prev.map(s => {
        if (s.id !== stickerId) return s;
        return {
          ...s,
          owned:          qty > 0,
          repeated_count: qty > 1 ? qty - 1 : 0,
        };
      })
    );

    // Guardar en BD
    const sticker = ALL_STICKERS.find(s => s.id === stickerId);
    if (!sticker) return;

    try {
      await api.post("/stickers/toggle", {
        sticker_id: sticker.code,
        quantity:   qty,
      });
    } catch {
      // Revertir si falla
      setStickers(prev =>
        prev.map(s => {
          if (s.id !== stickerId) return s;
          const original = ALL_STICKERS.find(o => o.id === stickerId);
          return { ...s, ...original };
        })
      );
    }
  }, []);

  // ── toggleSticker: primer clic = marcar, siguientes = +repetida ──
  // YA NO SE USA EN STICKERCARD — solo se mantiene por compatibilidad
  const toggleSticker = useCallback((stickerId) => {
    setStickers(prev => {
      const s = prev.find(x => x.id === stickerId);
      if (!s) return prev;
      const newQty = s.owned ? s.repeated_count + 2 : 1;
      // Llamar setQuantity de forma asíncrona
      setQuantity(stickerId, newQty);
      return prev; // setQuantity ya actualiza el estado
    });
  }, [setQuantity]);

  // ── resetSticker: pone en 0 ──────────────────────────────────────
  const resetSticker = useCallback((stickerId) => {
    setQuantity(stickerId, 0);
  }, [setQuantity]);

  return (
    <CollectionContext.Provider value={{
      stickers,
      loading,
      setQuantity,
      toggleSticker,
      resetSticker,
    }}>
      {children}
    </CollectionContext.Provider>
  );
}