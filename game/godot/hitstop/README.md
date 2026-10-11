---
prefixe: bib-hitstop
description: Gel d'impact (hitstop) + vibration, pour des coups qui ont du poids
langage: gdscript
fichier: hitstop.gd
---

# hitstop

1. Paramètres du projet → Globals → ajouter `hitstop.gd` sous le nom `Hitstop`.
2. Au moment de l'impact :

```gdscript
Hitstop.geler(0.06)                        # coup léger
Hitstop.geler(0.15, 0.05, 40)              # coup lourd : ralenti à 5 % + vibration 40 ms
```

À combiner avec `tremblement-camera` pour un vrai effet « Street Fighter ».

## Pièges

- `Engine.time_scale` ralentit **tout**, y compris les animations du HUD. Ce qui doit continuer (menu pause…) doit utiliser des minuteurs qui ignorent l'échelle de temps.
- Sur Android, la vibration nécessite la permission `VIBRATE` (case à cocher dans le préréglage d'export).
