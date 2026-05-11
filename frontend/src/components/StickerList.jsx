import { useContext, useState } from "react";
import { CollectionContext } from "../context/CollectionContext";
import "../styles/StickerList.css";

const TEAM_NAMES = {
  FWC: "Especiales",
  MEX: "México",        RSA: "Sudáfrica",         KOR: "Corea del Sur",    CZE: "República Checa",
  CAN: "Canadá",        BIH: "Bosnia y Herzegovina",QAT: "Catar",           SUI: "Suiza",
  BRA: "Brasil",        MAR: "Marruecos",          HAI: "Haití",            SCO: "Escocia",
  USA: "Estados Unidos",PAR: "Paraguay",           AUS: "Australia",        TUR: "Turquía",
  GER: "Alemania",      CUW: "Curazao",            CIV: "Costa de Marfil",  ECU: "Ecuador",
  NED: "Países Bajos",  JPN: "Japón",              SWE: "Suecia",           TUN: "Túnez",
  BEL: "Bélgica",       EGY: "Egipto",             IRN: "Irán",             NZL: "Nueva Zelanda",
  ESP: "España",        CPV: "Cabo Verde",          KSA: "Arabia Saudita",   URU: "Uruguay",
  FRA: "Francia",       SEN: "Senegal",            IRQ: "Irak",             NOR: "Noruega",
  ARG: "Argentina",     ALG: "Argelia",            AUT: "Austria",          JOR: "Jordania",
  POR: "Portugal",      COD: "Rep. Dem. del Congo", UZB: "Uzbekistán",      COL: "Colombia",
  ENG: "Inglaterra",    CRO: "Croacia",            GHA: "Ghana",            PAN: "Panamá",
};

// Orden de secciones para que FWC salga primero y luego grupos A→L
const SECTION_ORDER = [
  "FWC",
  "MEX","RSA","KOR","CZE",   // Grupo A
  "CAN","BIH","QAT","SUI",   // Grupo B
  "BRA","MAR","HAI","SCO",   // Grupo C
  "USA","PAR","AUS","TUR",   // Grupo D
  "GER","CUW","CIV","ECU",   // Grupo E
  "NED","JPN","SWE","TUN",   // Grupo F
  "BEL","EGY","IRN","NZL",   // Grupo G
  "ESP","CPV","KSA","URU",   // Grupo H
  "FRA","SEN","IRQ","NOR",   // Grupo I
  "ARG","ALG","AUT","JOR",   // Grupo J
  "POR","COD","UZB","COL",   // Grupo K
  "ENG","CRO","GHA","PAN",   // Grupo L
];

function groupByTeam(stickers) {
  const groups = {};
  stickers.forEach(s => {
    const prefix = s.code.replace(/\d+$/, "");
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(s);
  });
  return groups;
}

function sortedPrefixes(groups) {
  return SECTION_ORDER.filter(p => groups[p] && groups[p].length > 0);
}

export default function StickerList({ mode, onClose }) {
  const { stickers } = useContext(CollectionContext);
  const [copied, setCopied] = useState(false);

  const filtered = mode === "repeated"
    ? stickers.filter(s => s.repeated_count > 0)
    : stickers.filter(s => !s.owned);

  const groups   = groupByTeam(filtered);
  const prefixes = sortedPrefixes(groups);
  const total    = filtered.length;

  // ── Genera el texto formateado para WhatsApp ──────────────────────
  const generateWhatsApp = () => {
    const lines = [];

    if (mode === "missing") {
      lines.push(`📋 *Mis láminas faltantes — Mundial 2026*`);
      lines.push(`Me faltan ${total} láminas para completar mi álbum:`);
    } else {
      lines.push(`🔄 *Mis láminas repetidas — Mundial 2026*`);
      lines.push(`Tengo ${total} láminas repetidas disponibles para intercambio:`);
    }

    lines.push("");

    prefixes.forEach(prefix => {
      const teamName = TEAM_NAMES[prefix] || prefix;
      const teamStickers = groups[prefix];
      const count = teamStickers.length;

      lines.push(`⚽ *${teamName}* (${prefix}) — ${count}`);

      if (mode === "repeated") {
        const codes = teamStickers.map(s =>
          s.repeated_count > 1 ? `${s.code} (×${s.repeated_count})` : s.code
        ).join(", ");
        lines.push(codes);
      } else {
        const codes = teamStickers.map(s => s.code).join(", ");
        lines.push(codes);
      }
    });

    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push(`📲 Lista generada con *Gestor de Fichas* — app para coleccionar e intercambiar láminas del Mundial 2026.`);
    lines.push(`https://gestor-de-fichas-orpin.vercel.app`);

    return lines.join("\n");
  };

  const handleCopy = () => {
    const text = generateWhatsApp();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const title = mode === "repeated" ? "Repetidas" : "Me faltan";
  const preview = generateWhatsApp();

  return (
    <div className="sl-overlay" onClick={onClose}>
      <div className="sl-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sl-header">
          <div className="sl-title-row">
            <span className="sl-title">{title}</span>
            <span className="sl-count">{total} fichas</span>
          </div>
          <div className="sl-actions">
            <button className="sl-copy-btn" onClick={handleCopy}>
              {copied ? "✓ Copiado" : "📋 Copiar para WhatsApp"}
            </button>
            <button className="sl-close" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
        </div>

        {/* Lista visual */}
        <div className="sl-body">
          {prefixes.length === 0 ? (
            <div className="sl-empty">
              {mode === "repeated"
                ? "No tienes láminas repetidas aún."
                : "¡Tienes todas las láminas! 🏆"}
            </div>
          ) : (
            <div className="sl-list">
              {prefixes.map(prefix => {
                const teamName = TEAM_NAMES[prefix] || prefix;
                const teamStickers = groups[prefix];
                return (
                  <div key={prefix} className="sl-group">
                    <span className="sl-emoji">⚽</span>
                    <div className="sl-group-content">
                      <div className="sl-group-header">
                        <span className="sl-team-name">{teamName}</span>
                        <span className="sl-prefix">({prefix})</span>
                        <span className="sl-group-count">— {teamStickers.length}</span>
                      </div>
                      <div className="sl-codes">
                        {teamStickers.map((s, i) => (
                          <span key={s.id} className="sl-code-item">
                            <span className="sl-code">{s.code}</span>
                            {mode === "repeated" && s.repeated_count > 1 && (
                              <span className="sl-rep-count">(×{s.repeated_count})</span>
                            )}
                            {i < teamStickers.length - 1 && (
                              <span className="sl-comma">, </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview del texto que se copiará */}
        <div className="sl-raw-wrap">
          <span className="sl-raw-label">Vista previa del mensaje</span>
          <pre className="sl-raw">{preview}</pre>
        </div>

      </div>
    </div>
  );
}