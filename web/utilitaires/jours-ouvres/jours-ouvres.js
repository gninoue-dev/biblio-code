// Jours fériés et jours ouvrés (délais de virement, livraisons, échéances).
// Les dates sont des chaînes "AAAA-MM-JJ" en heure locale (pas de piège de fuseau horaire).

const versTexte = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const versDate = (texte) => {
  if (texte instanceof Date) return new Date(texte.getFullYear(), texte.getMonth(), texte.getDate());
  const [a, m, j] = String(texte).slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, j);
};
const decaler = (date, jours) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + jours);

// Dimanche de Pâques (algorithme de Meeus/Jones/Butcher)
export function datePaques(annee) {
  const a = annee % 19, b = Math.floor(annee / 100), c = annee % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  const jour = ((h + l - 7 * m + 114) % 31) + 1;
  return versTexte(new Date(annee, mois - 1, jour));
}

const FIXES = {
  CI: ["01-01", "05-01", "08-07", "08-15", "11-01", "11-15", "12-25"],
  FR: ["01-01", "05-01", "05-08", "07-14", "08-15", "11-01", "11-11", "12-25"],
};

// Jours fériés d'une année. Pour la Côte d'Ivoire, les fêtes musulmanes (Ramadan, Tabaski,
// Maouloud…) changent chaque année : ajoute-les avec l'option `feriesEnPlus` d'estJourOuvre.
export function joursFeries(annee, pays = "CI") {
  if (!FIXES[pays]) throw new Error(`Pays non géré : ${pays}`);
  const paques = versDate(datePaques(annee));
  const mobiles = [1, 39, 50].map((j) => versTexte(decaler(paques, j))); // lundi de Pâques, Ascension, lundi de Pentecôte
  return [...FIXES[pays].map((md) => `${annee}-${md}`), ...mobiles].sort();
}

export function estJourOuvre(date, { pays = "CI", feriesEnPlus = [], samediOuvre = false } = {}) {
  const d = versDate(date);
  const jour = d.getDay();
  if (jour === 0 || (jour === 6 && !samediOuvre)) return false;
  const texte = versTexte(d);
  return !joursFeries(d.getFullYear(), pays).includes(texte) && !feriesEnPlus.includes(texte);
}

// ajouterJoursOuvres("2026-12-24", 1) → "2026-12-28" (saute Noël et le week-end)
export function ajouterJoursOuvres(date, nombre, options = {}) {
  let d = versDate(date);
  const pas = nombre < 0 ? -1 : 1;
  for (let restants = Math.abs(nombre); restants > 0; ) {
    d = decaler(d, pas);
    if (estJourOuvre(d, options)) restants--;
  }
  return versTexte(d);
}

// Nombre de jours ouvrés après `debut`, jusqu'à `fin` incluse
export function joursOuvresEntre(debut, fin, options = {}) {
  let d = versDate(debut);
  const f = versDate(fin);
  let total = 0;
  while (d < f) {
    d = decaler(d, 1);
    if (estJourOuvre(d, options)) total++;
  }
  return total;
}
