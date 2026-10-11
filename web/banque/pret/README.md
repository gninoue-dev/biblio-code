---
prefixe: bib-pret
description: Simulateur de prêt : mensualité, tableau d'amortissement, coût total
langage: javascript
fichier: pret.js
---

# pret

```js
const capital = versUnitesMineures("100 000", "EUR");    // 10000000
formaterMontant(mensualite(capital, 3.5, 240));          // "579,96 €"
formaterMontant(coutTotalCredit(capital, 3.5, 240));     // coût des intérêts
tableauAmortissement(capital, 3.5, 240);                 // 240 lignes pour un tableau
```

## Pièges

- C'est le calcul standard (taux nominal, échéances constantes). Il ne compte ni l'assurance ni les frais de dossier : un vrai TAEG les inclut.
