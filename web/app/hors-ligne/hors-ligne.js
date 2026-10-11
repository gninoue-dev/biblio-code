// File d'attente hors ligne : les actions faites sans réseau sont gardées et envoyées au retour de la connexion.
// `envoyer(donnees)` doit lancer une erreur si l'envoi échoue. Une erreur avec `definitive: true`
// (ex. 400 refusé par le serveur) retire l'action de la file au lieu de la réessayer.
export function creerFileHorsLigne({ envoyer, cle = "file-hors-ligne", stockage = globalThis.localStorage, surChangement } = {}) {
  const lire = () => {
    try {
      return JSON.parse(stockage?.getItem(cle) ?? "[]");
    } catch {
      return [];
    }
  };
  let file = lire();
  let envoiEnCours = null;

  const enregistrer = () => {
    try {
      stockage?.setItem(cle, JSON.stringify(file));
    } catch {}
    surChangement?.(file.length);
  };

  async function vider() {
    if (globalThis.navigator?.onLine === false) return;
    envoiEnCours ??= (async () => {
      while (file.length) {
        try {
          await envoyer(file[0].donnees);
        } catch (erreur) {
          if (!erreur?.definitive) break; // réseau toujours absent : on réessaiera plus tard
        }
        file.shift();
        enregistrer();
      }
    })().finally(() => (envoiEnCours = null));
    return envoiEnCours;
  }

  function ajouter(donnees) {
    file.push({ id: crypto.randomUUID(), date: new Date().toISOString(), donnees });
    enregistrer();
    return vider();
  }

  globalThis.addEventListener?.("online", vider);
  return { ajouter, vider, enAttente: () => file.length, elements: () => file.map((e) => e.donnees) };
}
