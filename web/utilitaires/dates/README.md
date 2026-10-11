---
prefixe: bib-dates
description: Dates relatives (« il y a 3 h ») et formatage en français
langage: javascript
fichier: dates.js
---

# dates

```js
dateRelative(message.creeLe);                         // "il y a 5 minutes"
formaterDate("2026-10-11");                           // "11 octobre 2026"
formaterDate(new Date(), { dateStyle: "short", timeStyle: "short" }); // "11/10/2026 14:30"
```

Aucune bibliothèque externe : tout passe par `Intl`, intégré aux navigateurs.
