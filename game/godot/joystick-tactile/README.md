---
prefixe: bib-joystick
description: Joystick virtuel tactile multi-touch (Godot 4)
langage: gdscript
fichier: joystick_tactile.gd
---

# joystick-tactile

**À quoi ça sert :** déplacer un personnage sur mobile. Il gère le multi-touch, donc tu peux appuyer sur un bouton d'attaque avec l'autre doigt.

## Utilisation

1. Crée un `Control` (taille ≈ 200×200) dans un `CanvasLayer` et attache-lui le script.
2. Dans le joueur :

```gdscript
@onready var joystick = $"../HUD/Joystick"

func _physics_process(_delta):
	velocity = joystick.direction * vitesse
	move_and_slide()
```

## Pièges

- Pour tester à la souris sur PC : Paramètres du projet → Input Devices → Pointing → **Emulate Touch From Mouse**.
- Ne mets pas d'échelle (`scale`) sur le Control : change plutôt `rayon` et `size`.
