// localStorage en JSON, avec expiration optionnelle et sans planter (navigation privée, quota plein).
export const stockage = {
  ecrire(cle, valeur, dureeMs) {
    const entree = { valeur, expire: dureeMs ? Date.now() + dureeMs : null };
    try {
      localStorage.setItem(cle, JSON.stringify(entree));
      return true;
    } catch {
      return false;
    }
  },

  lire(cle, defaut = null) {
    try {
      const brut = localStorage.getItem(cle);
      if (brut === null) return defaut;
      const { valeur, expire } = JSON.parse(brut);
      if (expire && Date.now() > expire) {
        localStorage.removeItem(cle);
        return defaut;
      }
      return valeur;
    } catch {
      return defaut;
    }
  },

  supprimer(cle) {
    try {
      localStorage.removeItem(cle);
    } catch {}
  },
};
