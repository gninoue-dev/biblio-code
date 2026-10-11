---
prefixe: bib-carte
description: Carte bancaire : Luhn, réseau (Visa…), formatage, expiration, CVC
langage: javascript
fichier: carte-bancaire.js
---

# carte-bancaire

```js
champ.addEventListener("input", () => {
  champ.value = formaterNumeroCarte(champ.value);
  logo.src = `/logos/${detecterReseau(champ.value) ?? "carte"}.svg`;
  champ.classList.toggle("invalide", !validerLuhn(champ.value));
});
validerExpiration("08/27");  // true / false
validerCvc("123", "visa");   // true
```

## ⚠️ Sécurité (obligatoire)

- Ces fonctions servent **seulement à aider la saisie**. Pour encaisser un vrai paiement, utilise les champs hébergés d'un prestataire (Stripe Elements, CinetPay, PayDunya…) : le numéro de carte ne doit **jamais** passer par ton serveur ni être stocké (norme PCI-DSS).
- Numéros de test : `4111 1111 1111 1111` (Visa), `5555 5555 5555 4444` (Mastercard).
