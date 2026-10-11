---
prefixe: bib-jour
description: Contenu du jour (citation, défi, lettre) selon une date de départ
langage: kotlin
fichier: contenu-du-jour.kt
---

# contenu-du-jour

Pour les applis qui proposent quelque chose de nouveau chaque jour : citation, défi, conseil, leçon, lettre…

```kotlin
val debut = LocalDate.of(2026, 7, 15)
val citation = contenuDuJour(citations, debut)          // change à minuit
binding.titre.text = "Jour ${numeroDuJour(debut)}"
binding.rebours.text = "J-${joursAvant(LocalDate.of(2027, 7, 15))}"
```

## Prérequis

- `java.time` : Android 8 (API 26) minimum, ou active le *desugaring* (`coreLibraryDesugaringEnabled true`) pour les versions plus anciennes.
- Le calcul se base sur la date **locale** : le contenu change à minuit chez l'utilisateur, pas à minuit UTC.
