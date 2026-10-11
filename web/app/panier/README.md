---
prefixe: bib-panier
description: Panier e-commerce : quantités, code promo, livraison offerte, TVA
langage: javascript
fichier: panier.js
---

# panier

```js
let panier = [];
panier = ajouterAuPanier(panier, { id: "wax-01", nom: "Pagne wax", prix: 15000 }, 2);
panier = modifierQuantite(panier, "wax-01", 3);

const r = calculerPanier(panier, {
  remise: { type: "pourcentage", valeur: 10, minimum: 20000 }, // code promo -10 % dès 20 000 F
  livraison: 2000,
  livraisonGratuiteDes: 50000,
  tauxTva: 18, // TVA Côte d'Ivoire, déjà incluse dans les prix
});
// r.total, r.remise, r.dontTva, r.manquePourLivraisonGratuite → « Plus que 5 000 F pour la livraison offerte ! »
```

## Pièges

- Le navigateur calcule pour **afficher**. Le serveur doit recalculer le total avec ses propres prix avant d'encaisser, sinon un client peut modifier le prix dans la page.
