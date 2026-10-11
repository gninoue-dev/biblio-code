// État global minimal avec abonnements (alternative légère à Redux / Pinia / Zustand).
export function creerStore(etatInitial) {
  let etat = etatInitial;
  const abonnes = new Set();
  return {
    lire: () => etat,
    // modifier({ champ: valeur }) ou modifier((etat) => nouvelEtat)
    modifier(maj) {
      const suivant = typeof maj === "function" ? maj(etat) : { ...etat, ...maj };
      if (suivant === etat) return;
      etat = suivant;
      abonnes.forEach((f) => f(etat));
    },
    abonner(f) {
      abonnes.add(f);
      return () => abonnes.delete(f);
    },
  };
}
