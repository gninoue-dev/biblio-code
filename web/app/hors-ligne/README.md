---
prefixe: bib-hors-ligne
description: File d'attente hors ligne : actions envoyées au retour du réseau
langage: javascript
fichier: hors-ligne.js
---

# hors-ligne

Si la connexion coupe, l'utilisateur ne perd rien : ses actions sont gardées et envoyées dès que le réseau revient, même après avoir fermé la page.

```js
const file = creerFileHorsLigne({
  envoyer: async (donnees) => {
    const r = await fetch("/api/commandes", { method: "POST", body: JSON.stringify(donnees) });
    if (r.status >= 400 && r.status < 500) throw Object.assign(new Error("refusé"), { definitive: true });
    if (!r.ok) throw new Error("serveur indisponible");
  },
  surChangement: (n) => (badge.textContent = n ? `${n} en attente d'envoi` : ""),
});

await file.ajouter({ produit: "wax-01", quantite: 2 });
```

## Pièges

- Envoie une **clé d'idempotence** (module `soumission-unique`) avec chaque action, pour que le serveur ignore un doublon si l'envoi est rejoué.
- N'utilise pas cette file pour des paiements : un paiement doit être confirmé en direct.
