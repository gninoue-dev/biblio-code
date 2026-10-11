---
prefixe: bib-devises
description: Conversion de devises (EUR ↔ F CFA, USD…) en unités mineures
langage: javascript
fichier: devises.js
---

# devises

```js
convertir(10000, "EUR", "XOF", PARITE_FCFA);   // 100,00 € → 65596 F CFA
convertir(65596, "XOF", "EUR", PARITE_FCFA);   // → 10000 (100,00 €)

// Avec des taux venant d'une API :
const taux = await fetchJson("https://api.frankfurter.app/latest?from=EUR");
convertir(5000, "EUR", "USD", { EUR: 1, ...taux.rates });
```

## Pièges

- La parité EUR/franc CFA est fixe. Pour les autres devises, les taux changent en permanence : affiche toujours leur date.
