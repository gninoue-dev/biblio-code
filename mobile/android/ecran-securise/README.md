---
prefixe: bib-secure
description: Bloquer captures d'écran et aperçu dans les applis récentes (FLAG_SECURE)
langage: kotlin
fichier: ecran-securise.kt
---

# ecran-securise

Les applis bancaires l'activent toutes : personne ne peut capturer le solde ou un code, et l'écran n'apparaît pas dans la liste des applis récentes.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    protegerEcran() // avant setContentView, de préférence
    setContentView(R.layout.activity_compte)
}
```
