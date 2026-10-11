# biblio-code

Ma bibliothèque personnelle de morceaux de code réutilisables. Chaque dossier contient **une fonctionnalité** : le code, plus un README qui explique comment l'utiliser.

```
web/js/            JavaScript (navigateur)
mobile/android/    Kotlin (Android)
game/godot/        GDScript (Godot 4)
game/unity/        C# (Unity)
modele/            modèle de README pour les nouveaux snippets
outils/biblio.py   script de gestion
```

## Utiliser un snippet

- **Copier-coller** : ouvre le dossier et prends le fichier.
- **Dans VS Code** : tape le préfixe (ex. `bib-debounce`) puis `Tab`. Tous les préfixes commencent par `bib-`.

## Commandes

```bash
python3 outils/biblio.py liste                                   # voir tous les snippets
python3 outils/biblio.py nouveau game/godot/dash --langage gdscript   # créer un snippet
python3 outils/biblio.py generer                                 # régénérer les snippets VS Code
python3 outils/biblio.py installer                               # les rendre dispo dans tous tes projets VS Code
```

Langages reconnus : `javascript`, `typescript`, `html`, `css`, `kotlin`, `gdscript`, `csharp`, `python`.

## Ajouter un snippet

1. `python3 outils/biblio.py nouveau <catégorie>/<nom> --langage <langage>`
2. Écris le code dans le fichier créé.
3. Complète l'en-tête du README (`prefixe`, `description`) et l'explication.
4. `python3 outils/biblio.py installer`

**Règle d'or :** un snippet = une seule fonctionnalité, testée dans un vrai projet, avec ses pièges notés dans le README.
