---
prefixe: bib-recherche-tri
description: Recherche sans accents + tri naturel sur une liste d'objets
langage: javascript
fichier: tableau-donnees.js
---

# tableau-donnees

```js
let liste = rechercher(clients, "kone", ["nom", "email"]); // trouve « Koné »
liste = trierPar(liste, "nom");
liste = trierPar(liste, "solde", "desc");
```

À combiner avec `paginer()` pour faire un tableau de données complet.
