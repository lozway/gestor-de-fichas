import { useContext, useState } from "react";
import { CollectionContext } from "../context/CollectionContext";
import "../styles/StickerList.css";

const TEAMS = {
  FWC: { name: "Especiales",              flag: "🏆" },
  MEX: { name: "México",                  flag: "🇲🇽" },
  RSA: { name: "Sudáfrica",               flag: "🇿🇦" },
  KOR: { name: "Corea del Sur",           flag: "🇰🇷" },
  CZE: { name: "Rep. Checa",              flag: "🇨🇿" },
  CAN: { name: "Canadá",                  flag: "🇨🇦" },
  BIH: { name: "Bosnia y Herzegovina",    flag: "🇧🇦" },
  QAT: { name: "Catar",                   flag: "🇶🇦" },
  SUI: { name: "Suiza",                   flag: "🇨🇭" },
  BRA: { name: "Brasil",                  flag: "🇧🇷" },
  MAR: { name: "Marruecos",               flag: "🇲🇦" },
  HAI: { name: "Haití",                   flag: "🇭🇹" },
  SCO: { name: "Escocia",                 flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  USA: { name: "Estados Unidos",          flag: "🇺🇸" },
  PAR: { name: "Paraguay",                flag: "🇵🇾" },
  AUS: { name: "Australia",               flag: "🇦🇺" },
  TUR: { name: "Turquía",                 flag: "🇹🇷" },
  GER: { name: "Alemania",                flag: "🇩🇪" },
  CUW: { name: "Curazao",                 flag: "🇨🇼" },
  CIV: { name: "Costa de Marfil",         flag: "🇨🇮" },
  ECU: { name: "Ecuador",                 flag: "🇪🇨" },
  NED: { name: "Países Bajos",            flag: "🇳🇱" },
  JPN: { name: "Japón",                   flag: "🇯🇵" },
  SWE: { name: "Suecia",                  flag: "🇸🇪" },
  TUN: { name: "Túnez",                   flag: "🇹🇳" },
  BEL: { name: "Bélgica",                 flag: "🇧🇪" },
  EGY: { name: "Egipto",                  flag: "🇪🇬" },
  IRN: { name: "Irán",                    flag: "🇮🇷" },
  NZL: { name: "Nueva Zelanda",           flag: "🇳🇿" },
  ESP: { name: "España",                  flag: "🇪🇸" },
  CPV: { name: "Cabo Verde",              flag: "🇨🇻" },
  KSA: { name: "Arabia Saudita",          flag: "🇸🇦" },
  URU: { name: "Uruguay",                 flag: "🇺🇾" },
  FRA: { name: "Francia",                 flag: "🇫🇷" },
  SEN: { name: "Senegal",                 flag: "🇸🇳" },
  IRQ: { name: "Irak",                    flag: "🇮🇶" },
  NOR: { name: "Noruega",                 flag: "🇳🇴" },
  ARG: { name: "Argentina",               flag: "🇦🇷" },
  ALG: { name: "Argelia",                 flag: "🇩🇿" },
  AUT: { name: "Austria",                 flag: "🇦🇹" },
  JOR: { name: "Jordania",                flag: "🇯🇴" },
  POR: { name: "Portugal",                flag: "🇵🇹" },
  COD: { name: "Rep. Dem. del Congo",     flag: "🇨🇩" },
  UZB: { name: "Uzbekistán",              flag: "🇺🇿" },
  COL: { name: "Colombia",                flag: "🇨🇴" },
  ENG: { name: "Inglaterra",              flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  CRO: { name: "Croacia",                 flag: "🇭🇷" },
  GHA: { name: "Ghana",                   flag: "🇬🇭" },
  PAN: { name: "Panamá",                  flag: "🇵🇦" },
};

const SECTION_ORDER = [
  "FWC",
  "MEX","RSA","KOR","CZE",
  "CAN","BIH","QAT","SUI",
  "BRA","MAR","HAI","SCO",
  "USA","PAR","AUS","TUR",
  "GER","CUW","CIV","ECU",
  "NED","JPN","SWE","TUN",
  "BEL","EGY","IRN","NZL",
  "ESP","CPV","KSA","URU",
  "FRA","SEN","IRQ","NOR",
  "ARG","ALG","AUT","JOR",
  "POR","COD","UZB","COL",
  "ENG","CRO","GHA","PAN",
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
  return SECTION_ORDER.filter(p => groups[p]?.length > 0);
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

  const generateWhatsApp = () => {
    const lines = [];
    if (mode === "missing") {
      lines.push(`📋 *Mis láminas faltantes — Mundial 2026*`);
      lines.push(`Me faltan ${total} láminas para completar mi álbum:`);
    } else {
      lines.push(`🔄 *Mis láminas repetidas — Mundial 2026*`);
      lines.push(`Tengo ${total} láminas repetidas para intercambio:`);
    }
    lines.push("");

    prefixes.forEach(prefix => {
      const team = TEAMS[prefix] || { name: prefix, flag: "🏳️" };
      const teamStickers = groups[prefix];
      lines.push(`${team.flag} *${team.name}* (${prefix}) — ${teamStickers.length}`);
      if (mode === "repeated") {
        lines.push(teamStickers.map(s =>
          s.repeated_count > 1 ? `${s.code} (×${s.repeated_count})` : s.code
        ).join(", "));
      } else {
        lines.push(teamStickers.map(s => s.code).join(", "));
      }
    });

    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push(`📲 Lista generada con *Gestor de Fichas — Mundial 2026*`);
    lines.push(`https://gestor-de-fichas-orpin.vercel.app`);
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWhatsApp()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const title = mode === "repeated" ? "Repetidas" : "Me faltan";

  return (
    <div className="sl-overlay" onClick={onClose}>
      <div className="sl-panel" onClick={e => e.stopPropagation()}>

        {/* Header fijo */}
        <div className="sl-header">
          <div className="sl-title-row">
            <span className="sl-title">{title}</span>
            <span className="sl-count">{total} fichas</span>
          </div>
          <button className="sl-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Lista scrolleable */}
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
                const team = TEAMS[prefix] || { name: prefix, flag: "🏳️" };
                const teamStickers = groups[prefix];
                return (
                  <div key={prefix} className="sl-group">
                    <span className="sl-flag">{team.flag}</span>
                    <div className="sl-group-content">
                      <div className="sl-group-header">
                        <span className="sl-team-name">{team.name}</span>
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

        {/* Botón SIEMPRE visible abajo — fijo */}
        <div className="sl-footer">
          <button className="sl-copy-btn" onClick={handleCopy}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar para WhatsApp"}
          </button>
        </div>

      </div>
    </div>
  );
}