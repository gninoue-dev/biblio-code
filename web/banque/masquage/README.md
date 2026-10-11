---
prefixe: bib-masquer
description: Masquer IBAN, numéro de carte, téléphone, email (••••)
langage: javascript
fichier: masquage.js
---

# masquage

```js
masquer("4111 1111 1111 1111");         // "•••• •••• •••• 1111"
masquer("07 07 12 34 56", { visibles: 2 }); // "•• •• •• •• 56"
masquerEmail("awa.kone@mail.com");       // "a•••••••@mail.com"
```

## Pièges

- Le masquage côté navigateur sert à l'**affichage**. Si l'utilisateur n'a pas le droit de voir la donnée complète, c'est le **serveur** qui doit l'envoyer déjà masquée.
