---
prefixe: bib-lettres
description: Montant en toutes lettres en français (factures, chèques, contrats)
langage: javascript
fichier: montant-en-lettres.js
---

# montant-en-lettres

```js
montantEnLettres(150000, "XOF");    // "cent cinquante mille francs CFA"
montantEnLettres(123456, "EUR");    // "mille deux cent trente-quatre euros et cinquante-six centimes"
montantEnLettres(100000000, "EUR"); // "un million d'euros"
nombreEnLettres(80);                // "quatre-vingts"
nombreEnLettres(71);                // "soixante et onze"
```

Le module suit les règles d'accord traditionnelles : « quatre-vingts » mais « quatre-vingt mille », « deux cents » mais « deux cent un », « mille » invariable. Exemple de mention sur une facture : *« Arrêtée la présente facture à la somme de cent cinquante mille francs CFA. »*
