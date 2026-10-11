// Traductions avec variables : t("bonjour", { nom: "Awa" }) → "Bonjour Awa".
export function creerI18n(dictionnaires, langueParDefaut = "fr") {
  let langue = langueParDefaut;
  return {
    t(cle, variables = {}) {
      const texte = dictionnaires[langue]?.[cle] ?? dictionnaires[langueParDefaut]?.[cle] ?? cle;
      return texte.replace(/\{(\w+)\}/g, (_, nom) => variables[nom] ?? `{${nom}}`);
    },
    changerLangue(nouvelle) {
      if (dictionnaires[nouvelle]) langue = nouvelle;
    },
    get langue() {
      return langue;
    },
  };
}
