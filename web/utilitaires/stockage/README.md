---
prefixe: bib-stockage
description: localStorage JSON avec expiration, sans erreurs
langage: javascript
fichier: stockage.js
---

# stockage

```js
stockage.ecrire("filtres", { categorie: "courses" });
stockage.ecrire("cache-produits", produits, 10 * 60_000); // expire dans 10 min
const filtres = stockage.lire("filtres", {});
```

## Pièges

- **Jamais de jeton de connexion, de mot de passe ni de donnée bancaire dans localStorage** : n'importe quel script de la page peut le lire.
