---
prefixe: bib-reseau
description: Vérifie si le téléphone a vraiment Internet
langage: kotlin
fichier: connexion-reseau.kt
---

# connexion-reseau

**À quoi ça sert :** afficher un message « Pas de connexion » avant d'appeler une API.

## Utilisation

```kotlin
if (!estConnecte()) afficherErreur("Pas de connexion")
```

## Prérequis

- Dans `AndroidManifest.xml` : `<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />`
- Android 6 (API 23) minimum.
