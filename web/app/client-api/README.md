---
prefixe: bib-api
description: Client API REST avec jeton et renouvellement automatique
langage: javascript
fichier: client-api.js
---

# client-api

```js
let jetonAcces = null; // en mémoire uniquement

const api = creerClientApi({
  baseUrl: "https://api.monsite.com",
  lireJeton: () => jetonAcces,
  rafraichirJeton: async () => {
    const r = await fetch("https://api.monsite.com/auth/refresh", { method: "POST", credentials: "include" });
    if (!r.ok) return false;
    jetonAcces = (await r.json()).accessToken;
    return true;
  },
  surDeconnexion: () => (location.hash = "/connexion"),
});

const comptes = await api.get("/comptes");
await api.post("/virements", { vers: iban, montant: 15000 });
```

## Sécurité

- Garde le jeton d'accès **en mémoire** (variable), pas dans localStorage.
- Le jeton de renouvellement (*refresh token*) doit être dans un cookie `HttpOnly; Secure; SameSite=Strict` posé par le serveur.
