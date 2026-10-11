extends Node
## Autoload : sauvegarde/chargement de la progression en JSON dans user://

const CHEMIN := "user://sauvegarde.json"

var donnees: Dictionary = {}


func _ready() -> void:
	charger()


func sauvegarder() -> void:
	var fichier := FileAccess.open(CHEMIN, FileAccess.WRITE)
	if fichier == null:
		push_error("Sauvegarde impossible : %s" % error_string(FileAccess.get_open_error()))
		return
	fichier.store_string(JSON.stringify(donnees, "\t"))


func charger() -> void:
	if not FileAccess.file_exists(CHEMIN):
		return
	var resultat = JSON.parse_string(FileAccess.get_file_as_string(CHEMIN))
	if resultat is Dictionary:
		donnees = resultat
	else:
		push_warning("Sauvegarde illisible, ignorée.")
