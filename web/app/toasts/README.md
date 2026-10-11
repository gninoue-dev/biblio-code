---
prefixe: bib-toast
description: Notifications temporaires (succès, erreur…) sans dépendance
langage: javascript
fichier: toasts.js
---

# toasts

```js
toast("Virement envoyé", { type: "succes" });
toast("Solde insuffisant", { type: "erreur", duree: 5000 });
```

Types : `info`, `succes`, `erreur`, `alerte`. Aucun CSS à ajouter.
