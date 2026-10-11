---
prefixe: bib-upload
description: Glisser-déposer de fichiers avec contrôle type/taille et aperçu
langage: javascript
fichier: upload-fichiers.js
---

# upload-fichiers

```js
zoneDepot(document.querySelector("#zone"), {
  accepter: ["image/*", ".pdf"],
  tailleMaxMo: 10,
  surFichiers: (fichiers) => fichiers.forEach((f) => (img.src = apercuImage(f))),
  surErreur: (msg) => toast(msg, { type: "erreur" }),
});
```

```css
#zone { border: 2px dashed #999; padding: 2em; text-align: center; cursor: pointer; }
#zone.survol { border-color: #2563eb; background: #eff6ff; }
```

## Pièges

- Le contrôle du type côté navigateur se contourne facilement. Le **serveur** doit revérifier le vrai contenu du fichier.
