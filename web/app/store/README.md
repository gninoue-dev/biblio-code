---
prefixe: bib-store
description: Store d'état global avec abonnements (mini Redux)
langage: javascript
fichier: store.js
---

# store

```js
const store = creerStore({ utilisateur: null, panier: [] });

store.abonner((etat) => (badge.textContent = etat.panier.length));
store.modifier((e) => ({ ...e, panier: [...e.panier, produit] }));
store.modifier({ utilisateur: { nom: "Awa" } });
```

## Pièges

- Ne modifie jamais l'état directement (`etat.panier.push(...)`) : crée toujours un nouvel objet, sinon les abonnés ne sont pas prévenus.
