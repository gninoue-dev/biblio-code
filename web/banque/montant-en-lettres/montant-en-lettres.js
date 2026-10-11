// Écrit un nombre ou un montant en toutes lettres, en français (factures, chèques, contrats).
const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

function moinsDeCent(n) {
  if (n < 20) return UNITES[n];
  const d = Math.floor(n / 10);
  const u = n % 10;
  if (d === 7 || d === 9) return DIZAINES[d] + (d === 7 && u === 1 ? " et " : "-") + UNITES[10 + u];
  if (u === 0) return d === 8 ? "quatre-vingts" : DIZAINES[d];
  if (u === 1 && d !== 8) return `${DIZAINES[d]} et un`;
  return `${DIZAINES[d]}-${UNITES[u]}`;
}

// avantMille : « quatre-vingt mille », « deux cent mille » (pas de s devant mille)
function moinsDeMille(n, avantMille = false) {
  const c = Math.floor(n / 100);
  const r = n % 100;
  let texte;
  if (c === 0) texte = moinsDeCent(r);
  else if (c === 1) texte = r ? `cent ${moinsDeCent(r)}` : "cent";
  else texte = r ? `${UNITES[c]} cent ${moinsDeCent(r)}` : `${UNITES[c]} cents`;
  return avantMille ? texte.replace(/(cent|vingt)s$/, "$1") : texte;
}

// nombreEnLettres(1234) → "mille deux cent trente-quatre"
export function nombreEnLettres(n) {
  if (!Number.isSafeInteger(n) || n < 0 || n >= 1e12) throw new Error(`Nombre non géré : ${n}`);
  if (n === 0) return "zéro";
  const parties = [];
  let reste = n;
  for (const [valeur, nom] of [[1e9, "milliard"], [1e6, "million"]]) {
    const q = Math.floor(reste / valeur);
    if (q) parties.push(`${moinsDeMille(q)} ${nom}${q > 1 ? "s" : ""}`);
    reste %= valeur;
  }
  const milliers = Math.floor(reste / 1000);
  if (milliers) parties.push(milliers === 1 ? "mille" : `${moinsDeMille(milliers, true)} mille`);
  reste %= 1000;
  if (reste) parties.push(moinsDeMille(reste));
  return parties.join(" ");
}

const NOMS = {
  EUR: ["euro", "euros", "centime", "centimes"],
  XOF: ["franc CFA", "francs CFA"],
  XAF: ["franc CFA", "francs CFA"],
  USD: ["dollar", "dollars", "cent", "cents"],
  GBP: ["livre sterling", "livres sterling", "penny", "pence"],
};
const decimalesDevise = (devise) =>
  new Intl.NumberFormat("en", { style: "currency", currency: devise }).resolvedOptions().maximumFractionDigits;

// montantEnLettres(123456, "EUR") → "mille deux cent trente-quatre euros et cinquante-six centimes"
export function montantEnLettres(unites, devise = "EUR") {
  const noms = NOMS[devise];
  if (!noms) throw new Error(`Devise non gérée : ${devise}`);
  const facteur = 10 ** decimalesDevise(devise);
  const absolu = Math.abs(unites);
  const entier = Math.floor(absolu / facteur);
  const fraction = absolu % facteur;

  // « un million d'euros », « deux milliards de francs CFA »
  const de = entier >= 1e6 && entier % 1e6 === 0 ? (/^[aeiouy]/.test(noms[1]) ? "d'" : "de ") : "";
  let texte = `${nombreEnLettres(entier)} ${de}${entier > 1 ? noms[1] : noms[0]}`;
  if (fraction && noms[2]) texte += ` et ${nombreEnLettres(fraction)} ${fraction > 1 ? noms[3] : noms[2]}`;
  return (unites < 0 ? "moins " : "") + texte;
}
