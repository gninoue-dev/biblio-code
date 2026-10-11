// Calculs d'argent sans erreurs d'arrondi.
// Règle d'or : on stocke et calcule en UNITÉS MINEURES ENTIÈRES
// (centimes pour EUR/USD, francs pour XOF qui n'a pas de décimales).
// 0.1 + 0.2 = 0.30000000000000004 en JavaScript : jamais de float pour de l'argent.

// Nombre de décimales d'une devise : EUR → 2, XOF → 0, JPY → 0, TND → 3
export function decimalesDevise(devise) {
  return new Intl.NumberFormat("en", { style: "currency", currency: devise }).resolvedOptions()
    .maximumFractionDigits;
}

// Texte saisi → unités mineures. "1 234,56" (EUR) → 123456 ; "1.500" (XOF) → 1500
export function versUnitesMineures(texte, devise = "EUR") {
  const decimales = decimalesDevise(devise);
  const propre = String(texte).trim().replace(/[\s  ']/g, "").replace(/[^\d.,-]/g, "");
  const negatif = propre.startsWith("-");
  const corps = propre.replace(/^-/, "");
  const invalide = () => new Error(`Montant invalide : ${texte}`);
  if (!/^\d+([.,]\d+)*$/.test(corps)) throw invalide();

  const morceaux = corps.split(/[.,]/);
  let fraction = "";
  if (morceaux.length > 1 && decimales > 0 && morceaux.at(-1).length <= decimales) {
    fraction = morceaux.pop();
  }
  // Ce qui reste doit être des milliers bien formés : "1", "234", "567"
  if (morceaux.length > 1 && (morceaux[0].length > 3 || morceaux.slice(1).some((m) => m.length !== 3))) {
    throw invalide();
  }
  const unites = Number(morceaux.join("") + fraction.padEnd(decimales, "0"));
  if (!Number.isSafeInteger(unites)) throw invalide();
  return negatif ? -unites : unites;
}

export function depuisUnitesMineures(unites, devise = "EUR") {
  return unites / 10 ** decimalesDevise(devise);
}

// 123456 → "1 234,56 €" ; 1500 XOF → "1 500 F CFA"
export function formaterMontant(unites, devise = "EUR", { langue = "fr-FR", signe = "auto" } = {}) {
  return new Intl.NumberFormat(langue, { style: "currency", currency: devise, signDisplay: signe }).format(
    depuisUnitesMineures(unites, devise)
  );
}

// Répartit un montant sans perdre une unité.
// repartir(1000, 3) → [334, 333, 333] ; repartir(1000, [70, 30]) → [700, 300]
export function repartir(unites, partsOuRatios) {
  const ratios = Array.isArray(partsOuRatios) ? partsOuRatios : Array(partsOuRatios).fill(1);
  const total = ratios.reduce((a, b) => a + b, 0);
  const absolu = Math.abs(unites);
  const resultats = ratios.map((r) => Math.floor((absolu * r) / total));
  let reste = absolu - resultats.reduce((a, b) => a + b, 0);
  for (let i = 0; reste > 0; i = (i + 1) % ratios.length, reste--) resultats[i]++;
  return unites < 0 ? resultats.map((r) => -r) : resultats;
}

// Applique un pourcentage (frais, TVA, remise), arrondi au plus proche.
// appliquerTaux(10000, 1.5) → 150 (1,5 % de 100,00 €)
export function appliquerTaux(unites, tauxPourcent) {
  const brut = (unites * tauxPourcent) / 100;
  return Math.sign(brut) * Math.round(Math.abs(brut));
}
