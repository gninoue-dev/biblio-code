// Requête JSON avec délai max et nouvelles tentatives (attente 0,5 s, 1 s, 2 s…).
export async function fetchJson(url, { timeout = 8000, essais = 3, ...options } = {}) {
  for (let essai = 1; essai <= essais; essai++) {
    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), timeout);
    try {
      const reponse = await fetch(url, { ...options, signal: controleur.signal });
      if (!reponse.ok) {
        const erreur = new Error(`HTTP ${reponse.status}`);
        erreur.status = reponse.status;
        throw erreur;
      }
      return await reponse.json();
    } catch (erreur) {
      const erreurClient = erreur.status >= 400 && erreur.status < 500;
      if (essai === essais || erreurClient) throw erreur;
      await new Promise((r) => setTimeout(r, 500 * 2 ** (essai - 1)));
    } finally {
      clearTimeout(minuteur);
    }
  }
}
