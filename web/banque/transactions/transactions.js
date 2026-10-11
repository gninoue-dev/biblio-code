// Outils pour une liste de transactions :
// { date: "2026-10-05", libelle, montant (unités mineures, négatif = débit), categorie }

export function soldeTransactions(transactions, soldeInitial = 0) {
  return transactions.reduce((solde, t) => solde + t.montant, soldeInitial);
}

// { courses: { debits: -45000, credits: 0, nombre: 3 }, salaire: {...} }
export function totauxParCategorie(transactions) {
  const totaux = {};
  for (const t of transactions) {
    const c = (totaux[t.categorie ?? "autre"] ??= { debits: 0, credits: 0, nombre: 0 });
    if (t.montant < 0) c.debits += t.montant;
    else c.credits += t.montant;
    c.nombre++;
  }
  return totaux;
}

const cleMois = (date) => {
  if (typeof date === "string" && /^\d{4}-\d{2}/.test(date)) return date.slice(0, 7);
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Map "2026-10" → [transactions], du mois le plus récent au plus ancien
export function regrouperParMois(transactions) {
  const groupes = new Map();
  const triees = [...transactions].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  for (const t of triees) {
    const cle = cleMois(t.date);
    if (!groupes.has(cle)) groupes.set(cle, []);
    groupes.get(cle).push(t);
  }
  return groupes;
}

// Filtres : du/au (dates "AAAA-MM-JJ" incluses), min/max (valeur absolue), type, categorie, recherche
export function filtrerTransactions(transactions, { du, au, min, max, type, categorie, recherche } = {}) {
  const q = recherche?.toLowerCase().trim();
  return transactions.filter((t) => {
    const jour = String(t.date).slice(0, 10);
    const abs = Math.abs(t.montant);
    return (
      (!du || jour >= du) &&
      (!au || jour <= au) &&
      (min === undefined || abs >= min) &&
      (max === undefined || abs <= max) &&
      (!type || (type === "debit" ? t.montant < 0 : t.montant > 0)) &&
      (!categorie || t.categorie === categorie) &&
      (!q || t.libelle.toLowerCase().includes(q))
    );
  });
}

// CSV lisible par Excel (séparateur ;, virgule décimale, BOM UTF-8).
// Protège contre l'injection de formules (=, +, -, @ en début de libellé).
export function exporterCsv(transactions, { decimales = 2, separateur = ";" } = {}) {
  const texte = (v) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[";\n\r]/.test(s) || s.includes(separateur) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const montant = (u) => (u / 10 ** decimales).toFixed(decimales).replace(".", ",");
  const lignes = [["Date", "Libellé", "Catégorie", "Montant"].join(separateur)];
  for (const t of transactions) {
    lignes.push([String(t.date).slice(0, 10), texte(t.libelle), texte(t.categorie), montant(t.montant)].join(separateur));
  }
  return "﻿" + lignes.join("\r\n");
}
