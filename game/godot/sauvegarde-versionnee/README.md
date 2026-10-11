---
prefixe: bib-save-version
description: Sauvegarde versionnée : migrations, écriture sûre, copie de secours
langage: gdscript
fichier: sauvegarde_versionnee.gd
---

# sauvegarde-versionnee

**Le problème :** à la mise à jour 1.3, tu changes le format de la sauvegarde, et les joueurs perdent leur progression ou le jeu plante.

**La solution :**
- chaque sauvegarde porte un numéro de version ;
- au chargement, les fonctions `_migrer_X_vers_Y` convertissent les anciennes sauvegardes, une étape après l'autre ;
- l'écriture passe par un fichier temporaire, et la version précédente est gardée en `.bak`. Si le téléphone s'éteint pendant l'écriture, rien n'est perdu.

```gdscript
# Globals → sauvegarde_versionnee.gd sous le nom « Sauvegarde »
Sauvegarde.donnees["pieces"] += 100
Sauvegarde.sauvegarder()
```

## Faire évoluer le format

1. Passe `VERSION` à 4.
2. Écris `func _migrer_3_vers_4(d)`.
3. Ajoute le nouveau champ dans `_defaut()`.

C'est tout. Garde les anciennes migrations.

## Pièges

- En JSON, les nombres reviennent en `float` : utilise `int(...)` à la lecture.
