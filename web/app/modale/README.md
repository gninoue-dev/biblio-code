---
prefixe: bib-confirmer
description: Boîte de confirmation accessible (élément dialog, await)
langage: javascript
fichier: modale.js
---

# modale

```js
if (await confirmer("Supprimer ce bénéficiaire ?", { ok: "Supprimer" })) {
  await api.delete(`/beneficiaires/${id}`);
}
```

Remplace `window.confirm()` : on peut lui donner un style, et elle ne bloque pas la page.
