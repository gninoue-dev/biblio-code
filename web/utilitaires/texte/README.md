---
prefixe: bib-texte
description: slug d'URL, troncature, échappement HTML anti-XSS
langage: javascript
fichier: texte.js
---

# texte

```js
slugifier("Été à Abidjan !");     // "ete-a-abidjan"
tronquer(description, 80);        // "Un texte très long…"
el.innerHTML = `<b>${echapperHtml(nomSaisiParUtilisateur)}</b>`;
```

## Pièges

- Si tu n'as pas besoin de HTML, `el.textContent = texte` est encore plus sûr que `echapperHtml`.
