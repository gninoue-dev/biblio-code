---
prefixe: bib-argent
description: Montants en centimes, saisie, formatage €/F CFA, répartition, taux
langage: javascript
fichier: argent.js
---

# argent

**Le module le plus important pour une appli financière.** En JavaScript, `0.1 + 0.2 = 0.30000000000000004`. On stocke donc toujours les montants en **entiers** : des centimes pour l'euro, des francs pour le franc CFA (qui n'a pas de décimales).

```js
const montant = versUnitesMineures("1 234,56", "EUR");  // 123456
formaterMontant(montant, "EUR");                         // "1 234,56 €"
formaterMontant(150000, "XOF");                          // "150 000 F CFA"
formaterMontant(-2500, "EUR", { signe: "always" });      // "-25,00 €"

repartir(10000, 3);              // [3334, 3333, 3333] → la somme fait bien 10000
appliquerTaux(250000, 1.5);      // frais de 1,5 % → 3750
```

## Pièges

- `versUnitesMineures` **lance une erreur** si la saisie est ambiguë ou invalide : attrape-la pour afficher un message.
- En base de données, utilise un type entier (`BIGINT`) ou `DECIMAL`, jamais `FLOAT`.
