---
prefixe: bib-compresser
description: Compression/redimensionnement d'image avant envoi (photos téléphone)
langage: javascript
fichier: compression-image.js
---

# compression-image

Indispensable sur mobile : les envois sont plus rapides, coûtent moins de data et l'espace serveur est économisé.

```js
input.addEventListener("change", async () => {
  const photo = await compresserImage(input.files[0], { largeurMax: 1280, qualite: 0.75 });
  const donnees = new FormData();
  donnees.append("photo", photo);
  await fetch("/api/profil/photo", { method: "POST", body: donnees });
});
```

Le format `"image/webp"` est encore plus léger, tout en gardant la transparence.
