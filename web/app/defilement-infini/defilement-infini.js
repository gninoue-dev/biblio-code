// Charge la suite d'une liste quand l'élément « sentinelle » (en bas) devient visible.
// `chargerSuite` renvoie false quand il n'y a plus rien à charger.
// `racine` : le conteneur qui défile, si la liste est dans une boîte (null = la page entière).
export function defilementInfini(sentinelle, chargerSuite, { marge = "300px", racine = null } = {}) {
  let enCours = false;
  const observateur = new IntersectionObserver(
    async ([entree]) => {
      if (!entree.isIntersecting || enCours) return;
      enCours = true;
      try {
        const encore = await chargerSuite();
        if (encore === false) return observateur.disconnect();
        // Ré-observer : si la sentinelle est toujours visible, on recharge encore.
        observateur.unobserve(sentinelle);
        observateur.observe(sentinelle);
      } finally {
        enCours = false;
      }
    },
    { root: racine, rootMargin: marge }
  );
  observateur.observe(sentinelle);
  return () => observateur.disconnect();
}
