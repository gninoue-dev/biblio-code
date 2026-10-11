---
prefixe: bib-notif
description: Canal + affichage de notification (Android 8 à 15)
langage: kotlin
fichier: notifications.kt
---

# notifications

```kotlin
// Application.onCreate()
Notifications.creerCanal(this, "rappels", "Rappels", "Rappels quotidiens")

// N'importe où
Notifications.afficher(this, "rappels", 1, "C'est l'heure !", "Ta tâche du jour t'attend", R.drawable.ic_notif, MainActivity::class.java)
```

## Prérequis

- Permission dans le manifeste : `<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />`. Il faut aussi la **demander** à l'utilisateur sur Android 13+ (module `permission-notifications`).
- L'icône doit être blanche sur fond transparent, sinon elle s'affiche comme un carré gris.
