---
prefixe: bib-mobile-money
description: Numéros ivoiriens : validation, formatage, opérateur (Orange, MTN, Moov)
langage: javascript
fichier: mobile-money.js
---

# mobile-money

```js
operateurCI("07 07 12 34 56");          // { operateur: "Orange", type: "mobile" }
operateurCI("+225 05 55 12 34 56");     // { operateur: "MTN", type: "mobile" }
formaterTelephoneCI("0707123456", { international: true }); // "+225 07 07 12 34 56"
telephoneInternationalCI("07 07 12 34 56"); // "2250707123456" pour l'API de paiement
```

Utilise-le pour présélectionner « Orange Money / MTN MoMo / Moov Money » dans un formulaire de paiement selon le numéro saisi. Wave accepte les numéros de tous les opérateurs.

## Pièges

- Avec la portabilité du numéro, le préfixe indique l'opérateur **d'origine** : laisse toujours l'utilisateur corriger son choix.
- Le paiement lui-même passe par un agrégateur (CinetPay, PayDunya, Wave Business…) côté serveur.
