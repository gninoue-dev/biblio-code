---
prefixe: bib-copier
description: Bouton « Copier » vers le presse-papier
langage: javascript
fichier: presse-papier.js
---

# presse-papier

```js
bouton.addEventListener("click", async () => {
  toast((await copierTexte(iban)) ? "IBAN copié" : "Copie impossible");
});
```

## Pièges

- Ne fonctionne qu'en HTTPS (ou sur `localhost`) et après une action de l'utilisateur (un clic).
