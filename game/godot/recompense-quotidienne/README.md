---
prefixe: bib-quotidien
description: Récompense de connexion quotidienne avec série (rétention F2P)
langage: gdscript
fichier: recompense_quotidienne.gd
---

# recompense-quotidienne

Le mécanisme de fidélisation le plus simple et le plus efficace des jeux gratuits.

```gdscript
var quotidien := RecompenseQuotidienne.new()

func _ready():
	quotidien.depuis_dictionnaire(Sauvegarde.donnees.get("quotidien", {}))
	if quotidien.disponible():
		$Popup.afficher("Jour %d : %d pièces" % [quotidien.serie_si_reclamee(), quotidien.prochaine_recompense()])

func _on_reclamer():
	eco.crediter(&"pieces", quotidien.reclamer())
	Sauvegarde.donnees["quotidien"] = quotidien.vers_dictionnaire()
	Sauvegarde.sauvegarder()
```

## Pièges

- Le jour vient de l'horloge du téléphone : un joueur peut tricher en changeant l'heure. Pour un jeu solo, ce n'est pas grave. Pour un jeu compétitif, demande l'heure à un serveur.
