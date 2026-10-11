---
prefixe: bib-telecharger
description: Télécharger un fichier généré côté navigateur
langage: javascript
fichier: telechargement.js
---

# telechargement

```js
telechargerFichier(JSON.stringify(donnees, null, 2), "export.json", "application/json");
telechargerFichier(exporterCsv(transactions), "releve.csv", "text/csv;charset=utf-8");
```
