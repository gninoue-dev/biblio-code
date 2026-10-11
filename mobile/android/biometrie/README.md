---
prefixe: bib-biometrie
description: Déverrouillage par empreinte/visage avant une action sensible
langage: kotlin
fichier: biometrie.kt
---

# biometrie

Pour une appli bancaire, un coffre-fort de notes, un journal intime : demander l'empreinte à l'ouverture ou avant un virement.

```kotlin
demanderBiometrie(
    titre = "Confirmer le virement",
    sousTitre = "15 000 F CFA vers Awa Koné",
    surSucces = { envoyerVirement() },
    surEchec = { message -> Toast.makeText(this, message, Toast.LENGTH_SHORT).show() },
)
```

## Prérequis

- `<uses-permission android:name="android.permission.USE_BIOMETRIC" />`
- Android 9 (API 28) minimum. Sur Android 11 et plus, le code ou le schéma du téléphone est accepté en secours.
- Pour gérer plus finement les anciens téléphones, il existe la bibliothèque `androidx.biometric`.

## Pièges

- La biométrie **confirme que c'est bien le propriétaire du téléphone**. Elle ne remplace pas l'authentification côté serveur.
