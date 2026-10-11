---
prefixe: bib-jours-ouvres
description: Jours fériés CI/FR, Pâques, ajout de jours ouvrés (délais, échéances)
langage: javascript
fichier: jours-ouvres.js
---

# jours-ouvres

```js
joursFeries(2026, "CI");                 // ["2026-01-01", "2026-04-06", "2026-05-01", ...]
estJourOuvre("2026-08-07");              // false (fête de l'Indépendance)
ajouterJoursOuvres("2026-12-24", 2);     // "2026-12-29" : virement reçu sous 2 jours ouvrés
joursOuvresEntre("2026-10-01", "2026-10-31"); // pour calculer un délai de livraison

// Les fêtes musulmanes changent chaque année : ajoute les dates officielles publiées
estJourOuvre("2026-03-20", { feriesEnPlus: ["2026-03-20", "2026-05-27"] });
```

Jours fériés fixes pour la **Côte d'Ivoire** : 1er janvier, 1er mai, 7 août, 15 août, 1er novembre, 15 novembre, 25 décembre. S'y ajoutent le lundi de Pâques, l'Ascension et le lundi de Pentecôte, qui sont calculés automatiquement.

## Pièges

- Les fêtes musulmanes et les jours de pont décrétés par le gouvernement doivent être ajoutés à la main chaque année.
