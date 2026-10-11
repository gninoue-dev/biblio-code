---
prefixe: bib-vibrer
description: Vibration et retour tactile (succès, erreur, boutons)
langage: kotlin
fichier: vibration.kt
---

# vibration

```kotlin
bouton.setOnClickListener { it.retourTactile(); valider() }
vibrer(300)  // fin d'une session de concentration
```

## Prérequis

- `vibrer()` : `<uses-permission android:name="android.permission.VIBRATE" />`
- `retourTactile()` : aucune permission, et respecte le réglage « vibration au toucher » de l'utilisateur.
