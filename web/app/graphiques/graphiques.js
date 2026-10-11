// Petits graphiques SVG sans bibliothèque. Les fonctions renvoient du code SVG (texte).
const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const arrondi = (n) => Math.round(n * 10) / 10;

// Mini courbe d'évolution (solde, cours de l'or…)
export function sparkline(valeurs, { largeur = 120, hauteur = 32, couleur = "currentColor", epaisseur = 2 } = {}) {
  if (valeurs.length < 2) return `<svg width="${largeur}" height="${hauteur}"></svg>`;
  const min = Math.min(...valeurs);
  const etendue = Math.max(...valeurs) - min || 1;
  const m = epaisseur;
  const points = valeurs
    .map((v, i) => {
      const x = m + (i / (valeurs.length - 1)) * (largeur - 2 * m);
      const y = m + (1 - (v - min) / etendue) * (hauteur - 2 * m);
      return `${arrondi(x)},${arrondi(y)}`;
    })
    .join(" ");
  return `<svg width="${largeur}" height="${hauteur}" viewBox="0 0 ${largeur} ${hauteur}" role="img" aria-label="Évolution de ${valeurs[0]} à ${valeurs.at(-1)}"><polyline points="${points}" fill="none" stroke="${couleur}" stroke-width="${epaisseur}" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

// Histogramme horizontal : [{ libelle, valeur }] (dépenses par catégorie…)
export function barres(donnees, { largeur = 320, hauteurBarre = 22, ecart = 8, couleur = "currentColor", formater = String } = {}) {
  const max = Math.max(...donnees.map((d) => d.valeur), 0) || 1;
  const colonneLibelle = 100;
  const colonneValeur = 70;
  const zone = largeur - colonneLibelle - colonneValeur;
  const hauteur = donnees.length * (hauteurBarre + ecart);
  const lignes = donnees
    .map((d, i) => {
      const y = i * (hauteurBarre + ecart);
      const l = Math.max(0, (d.valeur / max) * zone);
      const milieu = y + hauteurBarre / 2;
      return `<g><title>${echapper(d.libelle)} : ${echapper(formater(d.valeur))}</title>` +
        `<text x="${colonneLibelle - 8}" y="${milieu}" text-anchor="end" dominant-baseline="middle" font-size="12" fill="currentColor">${echapper(d.libelle)}</text>` +
        `<rect x="${colonneLibelle}" y="${y}" width="${arrondi(l)}" height="${hauteurBarre}" rx="4" fill="${couleur}"/>` +
        `<text x="${arrondi(colonneLibelle + l + 6)}" y="${milieu}" dominant-baseline="middle" font-size="12" fill="currentColor">${echapper(formater(d.valeur))}</text></g>`;
    })
    .join("");
  return `<svg width="100%" viewBox="0 0 ${largeur} ${hauteur}" role="img">${lignes}</svg>`;
}
