---
prefixe: bib-routeur
description: Routeur SPA par hash avec paramètres (#/comptes/:id)
langage: javascript
fichier: routeur.js
---

# routeur

```js
const routeur = creerRouteur(
  {
    "/": () => afficherAccueil(),
    "/comptes": () => afficherComptes(),
    "/comptes/:id": ({ id }) => afficherCompte(id),
  },
  { pasTrouve: () => afficher404() }
);

routeur.aller("/comptes/42");
```

Les liens HTML marchent aussi : `<a href="#/comptes">Mes comptes</a>`.
