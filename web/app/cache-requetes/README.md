---
prefixe: bib-cache
description: Cache d'appels API (durée de vie, dédoublonnage, rafraîchissement en fond)
langage: javascript
fichier: cache-requetes.js
---

# cache-requetes

```js
const lireProduit = memoriserAsync((id) => api.get(`/produits/${id}`), { dureeMs: 5 * 60_000 });

await lireProduit(42); // requête réseau
await lireProduit(42); // instantané, depuis le cache
lireProduit.invalider(42); // après une modification

// Taux de change : affichage immédiat, mise à jour en arrière-plan
const lireTaux = memoriserAsync(() => fetchJson("/api/taux"), { dureeMs: 60_000, perime: true });
```

Ça économise des données mobiles et rend l'appli plus rapide. Une erreur n'est jamais gardée en cache.
