---
prefixe: bib-permnotif
description: Demande la permission d'envoyer des notifications (Android 13+)
langage: kotlin
fichier: permission-notifications.kt
---

# permission-notifications

**À quoi ça sert :** depuis Android 13, une appli doit demander la permission avant d'afficher des notifications.

## Prérequis

- Dans `AndroidManifest.xml` : `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />`
- `registerForActivityResult` doit être appelé comme propriété de l'activité (pas dans un clic).
