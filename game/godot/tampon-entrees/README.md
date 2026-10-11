---
prefixe: bib-tampon
description: Tampon d'entrées (input buffer) pour des commandes réactives
langage: gdscript
fichier: tampon_entrees.gd
---

# tampon-entrees

**Le problème :** le joueur appuie sur « attaque » 3 images avant la fin de l'animation précédente, et l'appui est ignoré. Le jeu paraît « mou ».

```gdscript
var tampon := TamponEntrees.new()

func _unhandled_input(event):
	for action in [&"attaque", &"saut", &"special"]:
		if event.is_action_pressed(action):
			tampon.enregistrer(action)

func _physics_process(delta):
	tampon.mettre_a_jour(delta)
	if peut_agir and tampon.consommer(&"attaque"):
		attaquer()
```

Une durée de 0,1 à 0,2 s est la norme des jeux de combat et de plateforme. Même principe pour le « coyote time » : autoriser un saut juste après avoir quitté le bord.
