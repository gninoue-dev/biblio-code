---
prefixe: bib-rappel
description: Notification de rappel quotidienne à heure fixe (WorkManager)
langage: kotlin
fichier: notification-quotidienne.kt
---

# notification-quotidienne

Rappel quotidien qui fonctionne même appli fermée et après un redémarrage du téléphone.

```kotlin
RappelsQuotidiens.programmer(this, heure = 8, minute = 30,
    titre = "Ta lettre du jour est arrivée 💌", texte = "Ouvre l'appli pour la lire",
    icone = R.drawable.ic_notif)

RappelsQuotidiens.annuler(this) // l'utilisateur désactive les rappels
```

## Prérequis

- `implementation("androidx.work:work-runtime-ktx:2.9.1")`
- Le module `notifications` (canal + affichage) et la permission de notifications.

## Pièges

- WorkManager économise la batterie : le rappel peut arriver **avec quelques minutes de retard**, ce qui convient pour un rappel. Pour une alarme à la seconde près (réveil, prise de médicament), il faut `AlarmManager.setExactAndAllowWhileIdle`, avec la permission `SCHEDULE_EXACT_ALARM`.
- Certaines marques (Xiaomi, Tecno, Infinix, Huawei) tuent les applis en arrière-plan. Explique à l'utilisateur comment désactiver l'optimisation de batterie pour ton appli.
