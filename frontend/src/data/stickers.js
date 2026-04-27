// src/data/stickers.js
// ─────────────────────────────────────────────────────────────────
// ÁLBUM PANINI FIFA WORLD CUP 2026 — 980 fichas
//
// Reglas de type (igual que la tabla stickers en Supabase):
//   FWCxx          → "especial"
//   XXX1           → "escudo"
//   XXX13          → "foto_equipo"
//   resto          → "jugador"
// ─────────────────────────────────────────────────────────────────

let _id = 1;
const s = (code, name, section, country, type) => ({
  id: _id, code, number: _id++, name, section, country, type,
  owned: false, repeated_count: 0,
});

// Genera las 20 fichas de un equipo respetando las reglas de type
const team = (prefix, teamName, section, country) => {
  const fichas = [];
  for (let i = 1; i <= 20; i++) {
    const code = `${prefix}${i}`;
    let type, name;
    if (i === 1) {
      type = "escudo";
      name = `Escudo ${teamName}`;
    } else if (i === 13) {
      type = "foto_equipo";
      name = `Foto equipo ${teamName}`;
    } else {
      type = "d";
      name = `${teamName} - Jugador`;
    }
    fichas.push(s(code, name, section, country, type));
  }
  return fichas;
};

export const ALL_STICKERS = [

  // ── FWC00–FWC19 — todas "especial" ───────────────────────────────
  s("FWC00", "Panini",           "especiales", null, "especial"),
  s("FWC01", "Trofeo Copa del Mundo ",    "especiales", null, "especial"),
  s("FWC02", "Trofeo Copa del Mundo ",    "especiales", null, "especial"),
  s("FWC03", "Mascotas",          "especiales", null, "especial"),
  s("FWC04", "Eslogan",          "especiales", null, "especial"),
  s("FWC05", "Balon Oficial",          "especiales", null, "especial"),
  s("FWC06", "Host CAN",          "especiales", null, "especial"),
  s("FWC07", "Host MEX",       "especiales", null, "especial"),
  s("FWC08", "Host USA",      "especiales", "USA", "especial"),
  s("FWC09", "Italia 1934",    "especiales", "USA", "especial"),
  s("FWC10", "Uruaguay 1950",           "especiales", "USA", "especial"),
  s("FWC11", "Alemania 1954",  "especiales", "USA", "especial"),
  s("FWC12", "Brasil 1962", "especiales", "USA", "especial"),
  s("FWC13", "Alemania 1974",       "especiales", "USA", "especial"),
  s("FWC14", "Argentina 1986","especiales","México","especial"),
  s("FWC15", "Brasil 1994",        "especiales", "México","especial"),
  s("FWC16", "Brasil 2002",     "especiales", "México","especial"),
  s("FWC17", "Italia 2006",            "especiales", "Canadá","especial"),
  s("FWC18", "Alemania 2014",             "especiales", "Canadá","especial"),
  s("FWC19", "Argentina 2022",         "especiales", "Canadá","especial"),

  // ── GRUPO A — México · Sudáfrica · Corea del Sur · Rep. Checa ────
  ...team("MEX", "México",          "grupo-a", "México"),
  ...team("RSA", "Sudáfrica",       "grupo-a", "Sudáfrica"),
  ...team("KOR", "Corea del Sur",   "grupo-a", "Corea del Sur"),
  ...team("CZE", "Rep. Checa",      "grupo-a", "República Checa"),

  // ── GRUPO B — Canadá · Bosnia · Catar · Suiza ────────────────────
  ...team("CAN", "Canadá",                "grupo-b", "Canadá"),
  ...team("BIH", "Bosnia y Herzegovina",  "grupo-b", "Bosnia y Herzegovina"),
  ...team("QAT", "Catar",                 "grupo-b", "Catar"),
  ...team("SUI", "Suiza",                 "grupo-b", "Suiza"),

  // ── GRUPO C — Brasil · Marruecos · Haití · Escocia ───────────────
  ...team("BRA", "Brasil",    "grupo-c", "Brasil"),
  ...team("MAR", "Marruecos", "grupo-c", "Marruecos"),
  ...team("HAI", "Haití",     "grupo-c", "Haití"),
  ...team("SCO", "Escocia",   "grupo-c", "Escocia"),

  // ── GRUPO D — EE.UU. · Paraguay · Australia · Turquía ────────────
  ...team("USA", "Estados Unidos", "grupo-d", "Estados Unidos"),
  ...team("PAR", "Paraguay",       "grupo-d", "Paraguay"),
  ...team("AUS", "Australia",      "grupo-d", "Australia"),
  ...team("TUR", "Turquía",        "grupo-d", "Turquía"),

  // ── GRUPO E — Alemania · Curazao · Costa de Marfil · Ecuador ─────
  ...team("GER", "Alemania",        "grupo-e", "Alemania"),
  ...team("CUW", "Curazao",         "grupo-e", "Curazao"),
  ...team("CIV", "Costa de Marfil", "grupo-e", "Costa de Marfil"),
  ...team("ECU", "Ecuador",         "grupo-e", "Ecuador"),

  // ── GRUPO F — Países Bajos · Japón · Suecia · Túnez ──────────────
  ...team("NED", "Países Bajos", "grupo-f", "Países Bajos"),
  ...team("JPN", "Japón",        "grupo-f", "Japón"),
  ...team("SWE", "Suecia",       "grupo-f", "Suecia"),
  ...team("TUN", "Túnez",        "grupo-f", "Túnez"),

  // ── GRUPO G — Bélgica · Egipto · Irán · Nueva Zelanda ────────────
  ...team("BEL", "Bélgica",       "grupo-g", "Bélgica"),
  ...team("EGY", "Egipto",        "grupo-g", "Egipto"),
  ...team("IRN", "Irán",          "grupo-g", "Irán"),
  ...team("NZL", "Nueva Zelanda", "grupo-g", "Nueva Zelanda"),

  // ── GRUPO H — España · Cabo Verde · Arabia Saudita · Uruguay ─────
  ...team("ESP", "España",         "grupo-h", "España"),
  ...team("CPV", "Cabo Verde",     "grupo-h", "Cabo Verde"),
  ...team("KSA", "Arabia Saudita", "grupo-h", "Arabia Saudita"),
  ...team("URU", "Uruguay",        "grupo-h", "Uruguay"),

  // ── GRUPO I — Francia · Senegal · Irak · Noruega ─────────────────
  ...team("FRA", "Francia", "grupo-i", "Francia"),
  ...team("SEN", "Senegal", "grupo-i", "Senegal"),
  ...team("IRQ", "Irak",    "grupo-i", "Irak"),
  ...team("NOR", "Noruega", "grupo-i", "Noruega"),

  // ── GRUPO J — Argentina · Argelia · Austria · Jordania ───────────
  ...team("ARG", "Argentina", "grupo-j", "Argentina"),
  ...team("ALG", "Argelia",   "grupo-j", "Argelia"),
  ...team("AUT", "Austria",   "grupo-j", "Austria"),
  ...team("JOR", "Jordania",  "grupo-j", "Jordania"),

  // ── GRUPO K — Portugal · RD Congo · Uzbekistán · Colombia ────────
  ...team("POR", "Portugal",   "grupo-k", "Portugal"),
  ...team("COD", "RD Congo",   "grupo-k", "RD Congo"),
  ...team("UZB", "Uzbekistán", "grupo-k", "Uzbekistán"),
  ...team("COL", "Colombia",   "grupo-k", "Colombia"),

  // ── GRUPO L — Inglaterra · Croacia · Ghana · Panamá ──────────────
  ...team("ENG", "Inglaterra", "grupo-l", "Inglaterra"),
  ...team("CRO", "Croacia",    "grupo-l", "Croacia"),
  ...team("GHA", "Ghana",      "grupo-l", "Ghana"),
  ...team("PAN", "Panamá",     "grupo-l", "Panamá"),
];