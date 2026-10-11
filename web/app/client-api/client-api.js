// Client HTTP pour API REST : JSON automatique, jeton Bearer, renouvellement du jeton sur 401.
export function creerClientApi({ baseUrl = "", lireJeton, rafraichirJeton, surDeconnexion } = {}) {
  let rafraichissement = null; // un seul renouvellement à la fois, même si 10 requêtes échouent

  async function requete(chemin, { methode = "GET", corps, entetes = {} } = {}, dejaReessaye = false) {
    const jeton = lireJeton?.();
    const reponse = await fetch(baseUrl + chemin, {
      method: methode,
      credentials: "include",
      headers: {
        ...(corps !== undefined && { "Content-Type": "application/json" }),
        ...(jeton && { Authorization: `Bearer ${jeton}` }),
        ...entetes,
      },
      body: corps !== undefined ? JSON.stringify(corps) : undefined,
    });

    if (reponse.status === 401 && rafraichirJeton && !dejaReessaye) {
      rafraichissement ??= rafraichirJeton().finally(() => (rafraichissement = null));
      const ok = await rafraichissement.catch(() => false);
      if (ok) return requete(chemin, { methode, corps, entetes }, true);
      surDeconnexion?.();
    }

    if (!reponse.ok) {
      const erreur = new Error(`HTTP ${reponse.status}`);
      erreur.status = reponse.status;
      erreur.donnees = await reponse.json().catch(() => null);
      throw erreur;
    }
    return reponse.status === 204 ? null : reponse.json();
  }

  return {
    get: (chemin, options) => requete(chemin, { ...options, methode: "GET" }),
    post: (chemin, corps, options) => requete(chemin, { ...options, methode: "POST", corps }),
    put: (chemin, corps, options) => requete(chemin, { ...options, methode: "PUT", corps }),
    patch: (chemin, corps, options) => requete(chemin, { ...options, methode: "PATCH", corps }),
    delete: (chemin, options) => requete(chemin, { ...options, methode: "DELETE" }),
  };
}
