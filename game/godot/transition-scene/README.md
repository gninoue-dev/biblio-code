---
prefixe: bib-transition
description: Changement de scène avec fondu au noir (autoload)
langage: gdscript
fichier: transition_scene.gd
---

# transition-scene

1. Globals → ajouter `transition_scene.gd` sous le nom `Transition`.
2. Partout :

```gdscript
Transition.changer_scene("res://scenes/combat.tscn")
```

Plus de coupure brutale entre le menu et le jeu, et un double clic pendant le fondu ne lance pas deux chargements.
