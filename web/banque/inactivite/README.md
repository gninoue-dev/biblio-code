---
prefixe: bib-inactivite
description: Déconnexion auto après inactivité avec avertissement
langage: javascript
fichier: inactivite.js
---

# inactivite

Les sites bancaires déconnectent l'utilisateur après quelques minutes sans activité.

```js
const session = surveillerInactivite({
  dureeMs: 5 * 60_000,
  avertirAvantMs: 60_000,
  surAvertissement: async () => {
    if (await confirmer("Vous allez être déconnecté. Rester connecté ?", { ok: "Rester" })) {
      session.relancer();
    }
  },
  surExpiration: () => deconnecter(),
});
```

## Pièges

- Le **serveur** doit aussi faire expirer la session : le code navigateur seul ne protège rien si quelqu'un réutilise le jeton.
