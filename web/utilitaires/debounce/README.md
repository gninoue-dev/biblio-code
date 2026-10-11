---
prefixe: bib-debounce
description: Retarde une fonction tant qu'elle est rappelée (recherche, resize…)
langage: javascript
fichier: debounce.js
---

# debounce

**À quoi ça sert :** éviter de lancer une recherche à chaque touche tapée, ou un recalcul à chaque pixel de redimensionnement.

## Utilisation

```js
input.addEventListener("input", debounce((e) => rechercher(e.target.value), 400));
```
