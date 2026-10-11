// Évalue la force d'un mot de passe : score de 0 à 5 + critères pour l'affichage.
export function forceMotDePasse(mdp) {
  const criteres = {
    longueur: mdp.length >= 12,
    minuscule: /[a-z]/.test(mdp),
    majuscule: /[A-Z]/.test(mdp),
    chiffre: /\d/.test(mdp),
    special: /[^A-Za-z0-9]/.test(mdp),
  };
  let score = Object.values(criteres).filter(Boolean).length;
  if (mdp.length < 8) score = Math.min(score, 1);
  if (/(.)\1{2,}/.test(mdp)) score = Math.max(score - 1, 0); // "aaa", "111"
  const niveaux = ["très faible", "très faible", "faible", "moyen", "fort", "très fort"];
  return { score, niveau: niveaux[score], criteres };
}
