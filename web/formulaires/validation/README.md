---
prefixe: bib-validation
description: Validation de formulaires (email, téléphone CI/FR, URL…)
langage: javascript
fichier: validation.js
---

# validation

```js
const { valide, erreurs } = validerFormulaire(donnees, {
  email: [[valider.nonVide, "Email obligatoire"], [valider.email, "Email invalide"]],
  telephone: [[valider.telephoneCI, "Numéro ivoirien invalide (ex. 07 07 12 34 56)"]],
  motDePasse: [[valider.longueurMin(12), "12 caractères minimum"]],
  confirmation: [[valider.identique(donnees.motDePasse), "Les mots de passe diffèrent"]],
});
```

## Pièges

- La validation côté navigateur sert au **confort** de l'utilisateur. Le serveur doit **toujours** revalider.
