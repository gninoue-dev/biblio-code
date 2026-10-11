---
prefixe: bib-scroll-infini
description: Défilement infini avec IntersectionObserver
langage: javascript
fichier: defilement-infini.js
---

# defilement-infini

```js
let page = 1;
defilementInfini(document.querySelector("#fin-liste"), async () => {
  const { elements, suivante } = await api.get(`/transactions?page=${page++}`);
  afficher(elements);
  return suivante !== null; // false = plus rien à charger
});
```
