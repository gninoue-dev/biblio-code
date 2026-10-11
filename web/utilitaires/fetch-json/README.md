---
prefixe: bib-fetch
description: fetch JSON avec timeout et nouvelles tentatives automatiques
langage: javascript
fichier: fetch-json.js
---

# fetch-json

**À quoi ça sert :** appeler une API sans rester bloqué si le serveur ne répond pas, et réessayer en cas de coupure réseau.

## Utilisation

```js
const produits = await fetchJson("/api/produits", { timeout: 5000, essais: 3 });
```

## Pièges

- Les erreurs 4xx (404, 401…) ne sont **pas** réessayées : réessayer ne changerait rien.
