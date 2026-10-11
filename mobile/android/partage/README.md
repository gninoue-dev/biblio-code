---
prefixe: bib-partager
description: Partager texte/fichier + ouvrir WhatsApp avec message prérempli
langage: kotlin
fichier: partage.kt
---

# partage

```kotlin
partagerTexte("J'utilise cette appli pour m'organiser : https://play.google.com/…")
partagerFichier(File(cacheDir, "recu.pdf"), "application/pdf")
ouvrirWhatsApp("Bonjour, je veux commander", numero = "2250707123456")
```

## Prérequis pour `partagerFichier`

Dans le `AndroidManifest.xml`, à l'intérieur de `<application>` :

```xml
<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.fichiers"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/chemins_partages" />
</provider>
```

`res/xml/chemins_partages.xml` :

```xml
<paths><cache-path name="cache" path="." /><files-path name="fichiers" path="." /></paths>
```
