---
prefixe: bib-rebours
description: Compte à rebours fiable (« Renvoyer le code dans 00:30 », promos)
langage: javascript
fichier: compte-a-rebours.js
---

# compte-a-rebours

```js
// Bouton « Renvoyer le code SMS »
bouton.disabled = true;
compteARebours(30_000, {
  surTic: (ms) => (bouton.textContent = `Renvoyer dans ${formaterDuree(ms)}`),
  surFin: () => { bouton.disabled = false; bouton.textContent = "Renvoyer le code"; },
});

// Fin d'une promo
compteARebours(new Date("2026-12-31T23:59:59") - Date.now(), { surTic: (ms) => (el.textContent = formaterDuree(ms)) });
```
