---
prefixe: bib-iban
description: Validation IBAN (mod 97) et BIC, formatage par blocs de 4
langage: javascript
fichier: iban.js
---

# iban

```js
validerIban("FR76 3000 6000 0112 3456 7890 189");  // true
validerIban("FR76 3000 6000 0112 3456 7890 188");  // false (erreur de frappe détectée)
formaterIban("fr7630006000011234567890189");       // "FR76 3000 6000 0112 3456 7890 189"
validerBic("BNPAFRPP");                            // true
```

La clé mod 97 détecte presque toutes les fautes de frappe et inversions de chiffres **avant** l'envoi d'un virement. Les longueurs sont contrôlées pour les pays européens et africains courants (Côte d'Ivoire et UEMOA : 28 caractères).

## Pièges

- Un IBAN valide n'est pas forcément un compte **existant** : seule la banque peut le confirmer.
