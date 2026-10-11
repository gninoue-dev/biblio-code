---
prefixe: bib-pwa
description: Appli installable (PWA) : service worker, bouton installer, état réseau
langage: javascript
fichier: pwa.js
---

# pwa

Une PWA s'installe sur l'écran d'accueil comme une vraie appli, sans passer par le Play Store, et peut marcher hors ligne.

```js
enregistrerServiceWorker("/sw.js");
boutonInstallation(document.querySelector("#installer"));
surveillerConnexion((enLigne) => bandeau.hidden = enLigne); // « Vous êtes hors ligne »
```

## Fichiers à créer

`manifest.webmanifest`, lié dans le HTML par `<link rel="manifest" href="/manifest.webmanifest">` :

```json
{
  "name": "Mon Appli", "short_name": "Appli", "start_url": "/", "display": "standalone",
  "background_color": "#ffffff", "theme_color": "#1d4ed8",
  "icons": [{ "src": "/icone-192.png", "sizes": "192x192", "type": "image/png" },
            { "src": "/icone-512.png", "sizes": "512x512", "type": "image/png" }]
}
```

`sw.js`, un service worker minimal : les pages s'ouvrent hors ligne grâce à la dernière version en cache.

```js
const CACHE = "v1";
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(caches.keys().then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c)))))
);
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request))
  );
});
```

## Pièges

- La PWA ne marche qu'en HTTPS. Sur iOS, l'installation se fait à la main (Partager → « Sur l'écran d'accueil »).
- Ne mets jamais en cache les réponses d'API qui contiennent des données personnelles ou bancaires.
