// Règles de validation courantes. Chaque règle reçoit la valeur et renvoie true/false.
export const valider = {
  nonVide: (v) => String(v ?? "").trim().length > 0,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()),
  telephoneCI: (v) => /^(?:(?:\+|00)225[\s.-]?)?(?:0[157]|2[157])(?:[\s.-]?\d{2}){4}$/.test(String(v).trim()),
  telephoneFR: (v) => /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(String(v).trim()),
  telephoneInternational: (v) => /^\+[1-9]\d{7,14}$/.test(String(v).replace(/[\s.-]/g, "")),
  url: (v) => {
    try {
      return ["http:", "https:"].includes(new URL(v).protocol);
    } catch {
      return false;
    }
  },
  longueurMin: (n) => (v) => String(v ?? "").length >= n,
  longueurMax: (n) => (v) => String(v ?? "").length <= n,
  identique: (autre) => (v) => v === autre,
};

// Valide un objet de données : { champ: [[regle, "message"], ...] }
// Renvoie { valide, erreurs: { champ: "premier message en échec" } }
export function validerFormulaire(donnees, regles) {
  const erreurs = {};
  for (const [champ, liste] of Object.entries(regles)) {
    for (const [regle, message] of liste) {
      if (!regle(donnees[champ] ?? "")) {
        erreurs[champ] = message;
        break;
      }
    }
  }
  return { valide: Object.keys(erreurs).length === 0, erreurs };
}
