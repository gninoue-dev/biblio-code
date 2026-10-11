// Panier e-commerce. Prix en unités mineures (centimes, ou francs CFA), prix TTC.
// Les fonctions ne modifient jamais le panier reçu : elles en renvoient un nouveau.

export function ajouterAuPanier(lignes, produit, quantite = 1) {
  const existe = lignes.some((l) => l.id === produit.id);
  if (!existe) return [...lignes, { ...produit, quantite }];
  return lignes.map((l) => (l.id === produit.id ? { ...l, quantite: l.quantite + quantite } : l));
}

export function modifierQuantite(lignes, id, quantite) {
  return quantite <= 0
    ? lignes.filter((l) => l.id !== id)
    : lignes.map((l) => (l.id === id ? { ...l, quantite } : l));
}

export function retirerDuPanier(lignes, id) {
  return lignes.filter((l) => l.id !== id);
}

// remise : { type: "pourcentage" | "montant", valeur, minimum? }
// livraison : frais fixes ; livraisonGratuiteDes : seuil de gratuité ; tauxTva : TVA incluse dans les prix
export function calculerPanier(lignes, { remise, livraison = 0, livraisonGratuiteDes, tauxTva = 0 } = {}) {
  const sousTotal = lignes.reduce((s, l) => s + l.prix * l.quantite, 0);
  const nombreArticles = lignes.reduce((s, l) => s + l.quantite, 0);

  let montantRemise = 0;
  let erreurRemise = null;
  if (remise) {
    if (remise.minimum && sousTotal < remise.minimum) erreurRemise = "minimum";
    else if (remise.type === "pourcentage") montantRemise = Math.round((sousTotal * remise.valeur) / 100);
    else montantRemise = Math.min(remise.valeur, sousTotal);
  }

  const apresRemise = sousTotal - montantRemise;
  const fraisLivraison =
    nombreArticles === 0 || (livraisonGratuiteDes !== undefined && apresRemise >= livraisonGratuiteDes) ? 0 : livraison;
  const total = apresRemise + fraisLivraison;
  const dontTva = tauxTva ? total - Math.round(total / (1 + tauxTva / 100)) : 0;

  return {
    nombreArticles,
    sousTotal,
    remise: montantRemise,
    erreurRemise,
    livraison: fraisLivraison,
    total,
    dontTva,
    manquePourLivraisonGratuite:
      livraisonGratuiteDes !== undefined ? Math.max(0, livraisonGratuiteDes - apresRemise) : null,
  };
}
