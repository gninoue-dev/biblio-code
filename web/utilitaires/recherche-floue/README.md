---
prefixe: bib-floue
description: Recherche tolérante aux fautes (« Vouliez-vous dire… »)
langage: javascript
fichier: recherche-floue.js
---

# recherche-floue

```js
const villes = ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro"];
suggestions("abidjn", villes);          // [{ element: "Abidjan", score: 0.86 }]
suggestions("yamousokro", villes)[0];   // "Yamoussoukro"

suggestions("kone", clients, { cle: (c) => c.nom }); // fonctionne aussi sur des objets
```

Idéal pour une page « aucun résultat » qui propose quand même quelque chose.

## Pièges

- Le calcul compare chaque candidat : c'est rapide jusqu'à quelques milliers d'éléments. Au-delà, utilise un moteur de recherche côté serveur.
