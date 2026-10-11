---
prefixe: bib-prefs
description: Sauvegarde de réglages simples avec SharedPreferences
langage: kotlin
fichier: preferences.kt
---

# preferences

**À quoi ça sert :** mémoriser des réglages ou un pseudo entre deux lancements.

## Utilisation

```kotlin
val prefs = Preferences(this)
if (prefs.premierLancement) { montrerTutoriel(); prefs.premierLancement = false }
```

## Prérequis

- Dépendance `androidx.core:core-ktx` (présente par défaut dans les projets Android Studio).
- Pour des données plus grosses ou structurées, utilise plutôt Room ou DataStore.
