---
prefixe: bib-etats
description: Machine à états (joueur, ennemi, IA, menus) par fonctions
langage: gdscript
fichier: machine_etats.gd
---

# machine-etats

**À quoi ça sert :** fini les `if est_en_saut and not est_en_attaque and ...`. Chaque état a son propre code d'entrée, de mise à jour et de sortie.

```gdscript
var etats := MachineEtats.new()

func _ready():
	etats.ajouter(&"repos", func(): $Anim.play("repos"), _repos) \
		.ajouter(&"course", func(): $Anim.play("course"), _course) \
		.ajouter(&"saut", _entrer_saut, _saut)
	etats.changer(&"repos")

func _physics_process(delta):
	etats.mettre_a_jour(delta)

func _repos(_delta):
	if Input.get_axis("gauche", "droite") != 0.0:
		etats.changer(&"course")
```

`etats.temps_dans_etat` indique depuis combien de temps on est dans l'état : utile pour les attaques, les invincibilités et les délais d'IA.
