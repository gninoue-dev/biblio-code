// Numéros ivoiriens (10 chiffres depuis 2021) et opérateur mobile money.
const MOBILES = { "01": "Moov Africa", "05": "MTN", "07": "Orange" };
const FIXES = { 21: "Moov Africa", 25: "MTN", 27: "Orange" };

// "+225 07 07 12 34 56" / "00225..." / "07.07.12.34.56" → "0707123456", ou null si invalide
export function normaliserTelephoneCI(numero) {
  let n = String(numero ?? "").replace(/[\s.\-()]/g, "");
  if (n.startsWith("+225")) n = n.slice(4);
  else if (n.startsWith("00225")) n = n.slice(5);
  else if (n.length === 13 && n.startsWith("225")) n = n.slice(3);
  return /^\d{10}$/.test(n) && (MOBILES[n.slice(0, 2)] || FIXES[n.slice(0, 2)]) ? n : null;
}

// { operateur: "Orange", type: "mobile" } ou null
export function operateurCI(numero) {
  const n = normaliserTelephoneCI(numero);
  if (!n) return null;
  const prefixe = n.slice(0, 2);
  if (MOBILES[prefixe]) return { operateur: MOBILES[prefixe], type: "mobile" };
  return { operateur: FIXES[prefixe], type: "fixe" };
}

// "0707123456" → "07 07 12 34 56" ; { international: true } → "+225 07 07 12 34 56"
export function formaterTelephoneCI(numero, { international = false } = {}) {
  const n = normaliserTelephoneCI(numero);
  if (!n) return String(numero ?? "");
  const groupes = n.match(/\d{2}/g).join(" ");
  return international ? `+225 ${groupes}` : groupes;
}

// Format attendu par la plupart des API de paiement : "2250707123456"
export function telephoneInternationalCI(numero) {
  const n = normaliserTelephoneCI(numero);
  return n ? `225${n}` : null;
}
