---
prefixe: bib-i18n
description: Traductions multilingues avec variables
langage: javascript
fichier: i18n.js
---

# i18n

```js
const i18n = creerI18n({
  fr: { bonjour: "Bonjour {nom}", solde: "Votre solde" },
  en: { bonjour: "Hello {nom}", solde: "Your balance" },
});

i18n.t("bonjour", { nom: "Awa" }); // "Bonjour Awa"
i18n.changerLangue("en");
```

Si une clé manque dans une langue, c'est la langue par défaut qui est utilisée.
