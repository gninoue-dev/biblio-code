---
prefixe: bib-graphique
description: Graphiques SVG sans bibliothèque (sparkline, barres)
langage: javascript
fichier: graphiques.js
---

# graphiques

```js
el.innerHTML = sparkline([120, 135, 128, 160, 155, 172], { couleur: "#15803d" });

el.innerHTML = barres(
  [{ libelle: "Logement", valeur: 171750 }, { libelle: "Courses", valeur: 79700 }],
  { couleur: "#1d4ed8", formater: (v) => formaterMontant(v, "XOF") }
);
```

Pas de bibliothèque de 200 Ko pour deux graphiques. Les libellés sont échappés, et la couleur du texte suit le thème (`currentColor`).

## Pièges

- Pour des graphiques interactifs (zoom, plusieurs séries, axes de dates), passe à une vraie bibliothèque, comme Chart.js.
