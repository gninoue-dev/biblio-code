---
prefixe: bib-crypto
description: UUID, code OTP, jeton aléatoire sûrs et empreinte SHA-256
langage: javascript
fichier: crypto.js
---

# crypto

```js
identifiantUnique();        // "3b241101-e2bb-4255-8caf-4136c566a962"
codeAleatoire(6);           // "048213" (code SMS, côté serveur Node)
codeAleatoire(8, "ABCDEFGHJKMNPQRSTUVWXYZ23456789"); // code promo lisible, sans O/0 ni I/1
jetonAleatoire();           // lien d'invitation, jeton de réinitialisation
await sha256("texte");      // empreinte pour vérifier qu'un fichier n'a pas changé
```

## Pièges

- `sha256` ne sert **pas** à stocker des mots de passe : pour ça, le serveur utilise `bcrypt` ou `argon2`.
- `crypto.subtle` n'existe qu'en HTTPS (ou sur `localhost`).
