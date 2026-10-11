// Mini routeur pour application monopage (SPA) basé sur le hash : "#/comptes/:id".

// Teste un chemin contre un motif et renvoie les paramètres, ou null.
export function correspondreRoute(motif, chemin) {
  const noms = [];
  const source = motif
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/:(\w+)/g, (_, nom) => {
      noms.push(nom);
      return "([^/]+)";
    });
  const m = chemin.match(new RegExp(`^${source}/?$`));
  if (!m) return null;
  return Object.fromEntries(noms.map((n, i) => [n, decodeURIComponent(m[i + 1])]));
}

export function creerRouteur(routes, { pasTrouve } = {}) {
  function resoudre() {
    const chemin = location.hash.slice(1) || "/";
    for (const [motif, action] of Object.entries(routes)) {
      const params = correspondreRoute(motif, chemin);
      if (params) return action(params);
    }
    pasTrouve?.(chemin);
  }
  addEventListener("hashchange", resoudre);
  resoudre();
  return { aller: (chemin) => (location.hash = chemin), resoudre };
}
