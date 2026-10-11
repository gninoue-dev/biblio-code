// Parcours en plusieurs étapes (ouverture de compte, commande, inscription…).
// etapes : [{ id, valider?: (donnees) => ({ champ: "message" }) | null }]
export function creerParcours(etapes, donneesInitiales = {}) {
  let index = 0;
  let donnees = { ...donneesInitiales };
  const validee = new Set();

  const valider = (i) => {
    const erreurs = etapes[i].valider?.(donnees) ?? null;
    return erreurs && Object.keys(erreurs).length ? erreurs : null;
  };

  return {
    get etape() { return etapes[index]; },
    get index() { return index; },
    get donnees() { return donnees; },
    get progression() { return etapes.length > 1 ? index / (etapes.length - 1) : 1; },
    get estPremiere() { return index === 0; },
    get estDerniere() { return index === etapes.length - 1; },

    modifier(maj) {
      donnees = { ...donnees, ...maj };
    },
    // Valide l'étape en cours puis avance. Renvoie { ok, erreurs }.
    suivant() {
      const erreurs = valider(index);
      if (erreurs) return { ok: false, erreurs };
      validee.add(index);
      if (index < etapes.length - 1) index++;
      return { ok: true, erreurs: null };
    },
    precedent() {
      if (index > 0) index--;
    },
    // On ne peut sauter qu'à une étape déjà atteinte (pas de triche sur la validation).
    allerA(id) {
      const cible = etapes.findIndex((e) => e.id === id);
      if (cible === -1 || (cible > index && ![...Array(cible).keys()].every((i) => validee.has(i)))) return false;
      index = cible;
      return true;
    },
    // Revalide tout avant l'envoi final
    terminer() {
      for (let i = 0; i < etapes.length; i++) {
        const erreurs = valider(i);
        if (erreurs) {
          index = i;
          return { ok: false, erreurs, etape: etapes[i].id };
        }
      }
      return { ok: true, donnees };
    },
  };
}
