---
prefixe: bib-boutons-mobiles
description: Boutons tactiles déplaçables par le joueur, positions mémorisées
langage: gdscript
fichier: boutons_deplacables.gd
---

# boutons-deplacables

Chaque joueur a des pouces différents. Laisse-le placer ses boutons dans les options, comme dans les grands jeux mobiles.

1. Mets tes boutons tactiles (`TouchScreenButton`, `Button` ou ton joystick) **dans un même `Control`** qui porte ce script.
2. Dans l'écran Options :

```gdscript
$HUD/Commandes.mode_edition = true   # le joueur fait glisser les boutons
# bouton « Terminé » :
$HUD/Commandes.mode_edition = false
# bouton « Disposition par défaut » :
$HUD/Commandes.reinitialiser()
```

Les positions sont rechargées automatiquement au lancement.

## Pièges

- En mode édition, pense à désactiver les actions de jeu, sinon déplacer « Attaque » déclenche une attaque.
- Pour du `TouchScreenButton` (un `Node2D`, pas un `Control`), enveloppe chaque bouton dans un petit `Control` à sa taille.
