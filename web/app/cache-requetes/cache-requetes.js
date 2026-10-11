// Met en cache le résultat d'une fonction asynchrone (appel d'API) pendant `dureeMs`.
// - Deux appels simultanés avec les mêmes arguments ne déclenchent qu'une seule requête.
// - `perime: true` : renvoie tout de suite l'ancienne valeur et la rafraîchit en arrière-plan.
export function memoriserAsync(fn, { dureeMs = 60_000, perime = false, cle = (...args) => JSON.stringify(args) } = {}) {
  const cache = new Map(); // cle → { valeur, expire, aValeur, promesse }

  function rafraichir(k, args) {
    const entree = cache.get(k) ?? {};
    entree.promesse = Promise.resolve()
      .then(() => fn(...args))
      .then(
        (valeur) => {
          cache.set(k, { valeur, aValeur: true, expire: Date.now() + dureeMs });
          return valeur;
        },
        (erreur) => {
          if (entree.aValeur) delete entree.promesse;
          else cache.delete(k);
          throw erreur;
        }
      );
    cache.set(k, entree);
    return entree.promesse;
  }

  const memorisee = (...args) => {
    const k = cle(...args);
    const entree = cache.get(k);
    if (entree?.aValeur && entree.expire > Date.now()) return Promise.resolve(entree.valeur);
    if (entree?.promesse) return entree.aValeur && perime ? Promise.resolve(entree.valeur) : entree.promesse;
    if (entree?.aValeur && perime) {
      rafraichir(k, args).catch(() => {});
      return Promise.resolve(entree.valeur);
    }
    return rafraichir(k, args);
  };

  memorisee.invalider = (...args) => (args.length ? cache.delete(cle(...args)) : cache.clear());
  return memorisee;
}
