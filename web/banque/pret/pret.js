// Simulateur de prêt à taux fixe (mensualités constantes). Montants en unités mineures.

// mensualite(10_000_000, 3.5, 240) → 57996 (100 000 € à 3,5 % sur 20 ans = 579,96 €/mois)
export function mensualite(capital, tauxAnnuelPourcent, dureeMois) {
  const t = tauxAnnuelPourcent / 100 / 12;
  if (t === 0) return Math.round(capital / dureeMois);
  return Math.round((capital * t) / (1 - (1 + t) ** -dureeMois));
}

// Une ligne par mois : { mois, mensualite, interets, principal, restant }
export function tableauAmortissement(capital, tauxAnnuelPourcent, dureeMois) {
  const t = tauxAnnuelPourcent / 100 / 12;
  const paiement = mensualite(capital, tauxAnnuelPourcent, dureeMois);
  const lignes = [];
  let restant = capital;
  for (let mois = 1; mois <= dureeMois; mois++) {
    const interets = Math.round(restant * t);
    // La dernière échéance solde exactement le capital restant.
    const principal = mois === dureeMois ? restant : paiement - interets;
    restant -= principal;
    lignes.push({ mois, mensualite: principal + interets, interets, principal, restant });
  }
  return lignes;
}

// Total des intérêts payés sur toute la durée
export function coutTotalCredit(capital, tauxAnnuelPourcent, dureeMois) {
  return tableauAmortissement(capital, tauxAnnuelPourcent, dureeMois).reduce((s, l) => s + l.interets, 0);
}
