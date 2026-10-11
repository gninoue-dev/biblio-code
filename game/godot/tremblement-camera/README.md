---
prefixe: bib-shake
description: Tremblement de caméra 2D sur les impacts (Godot 4)
langage: gdscript
fichier: tremblement_camera.gd
---

# tremblement-camera

**À quoi ça sert :** donner du poids aux coups. Il marche bien avec le hitstop d'un jeu de combat.

## Utilisation

Attache le script à ta `Camera2D`, puis :

```gdscript
$Camera2D.secouer(0.3)   # coup léger
$Camera2D.secouer(0.8)   # coup puissant
```

Le tremblement augmente avec le carré du « trauma » : les petits coups restent discrets et les gros secouent vraiment.
