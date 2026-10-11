---
prefixe: bib-etapes
description: Formulaire en plusieurs étapes avec validation et progression
langage: javascript
fichier: formulaire-etapes.js
---

# formulaire-etapes

```js
const parcours = creerParcours([
  { id: "identite", valider: (d) => (d.nom ? null : { nom: "Nom obligatoire" }) },
  { id: "contact", valider: (d) => (valider.telephoneCI(d.telephone ?? "") ? null : { telephone: "Numéro invalide" }) },
  { id: "confirmation" },
]);

parcours.modifier({ nom: "Awa Koné" });
const { ok, erreurs } = parcours.suivant();
barre.style.width = `${parcours.progression * 100}%`;
afficherEtape(parcours.etape.id);

const fin = parcours.terminer(); // revalide tout avant l'envoi
if (fin.ok) await api.post("/comptes", fin.donnees);
```

Ce module gère seulement la logique. L'affichage reste libre : une `<section>` par étape, que tu affiches ou masques selon `parcours.etape.id`.
